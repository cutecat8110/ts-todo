// Local-only API fixture for repeatable QA. No requests are forwarded to production.
import http from 'node:http'
import { readFileSync } from 'node:fs'
const demo = JSON.parse(readFileSync(new URL('../src/config/demo-account.json', import.meta.url), 'utf8'))
let users = new Map([['test@example.com', { password: 'test123456', nickname: 'QA 測試者' }], [demo.email, { password: demo.password, nickname: 'QA 展示訪客' }]])
let todos = [
  { id: 'qa-a', content: 'QA 第一筆待辦', createTime: 1, status: false },
  { id: 'qa-b', content: 'QA 第二筆待辦\n第二行內容', createTime: 2, status: false }
]
let count = 2
const sessions = new Set()
const requests = []
let config = {}
const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Content-Type', 'application/json')
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  let raw = ''; for await (const chunk of req) raw += chunk
  const body = raw ? JSON.parse(raw) : {}
  const send = (status, data) => { res.writeHead(status); res.end(JSON.stringify(data)) }
  if (path === '/__qa/state') return send(200, { todos, requests, config })
  if (path === '/__qa/config') { config = body; return send(200, { status: true }) }
  if (path === '/__qa/reset') {
    todos = body.todos ?? []; requests.length = 0; config = {}; return send(200, { status: true })
  }
  requests.push({ method: req.method, path, ...(path.startsWith('/todos') ? { body } : {}) })
  if (config.delay) await new Promise(resolve => setTimeout(resolve, config.delay))
  if (config.failNext === req.method || config.failPath === path) {
    config.failNext = undefined
    return send(config.status ?? 503, { status: false, message: 'QA 模擬服務失敗' })
  }
  if (path === '/users/sign_in') {
    const user = users.get(body.email)
    if (!user || user.password !== body.password) return send(404, { status: false, message: '帳號密碼驗證錯誤' })
    const token = `fixture-${Date.now()}`; sessions.add(token)
    return send(200, { status: true, token, nickname: user.nickname, exp: 9999999999 })
  }
  if (path === '/users/sign_up') {
    if (users.has(body.email)) return send(400, { status: false, message: '用戶已存在' })
    if (!/^\S+@\S+\.\S+$/.test(body.email) || body.password.length < 6 || !body.nickname.trim()) return send(400, { status: false, message: '欄位驗證失敗' })
    users.set(body.email, body); return send(201, { status: true, uid: 'qa-user' })
  }
  if (config.expired || !sessions.has(req.headers.authorization)) return send(401, { status: false, message: '登入已失效' })
  if (path === '/users/checkout') return send(200, { status: true, uid: 'qa-user' })
  if (path === '/users/sign_out') { sessions.delete(req.headers.authorization); return send(200, { status: true, message: '登出成功' }) }
  if (path === '/todos' && req.method === 'GET') return send(200, { status: true, data: todos })
  if (path === '/todos' && req.method === 'POST') {
    if (!body.content?.trim()) return send(400, { status: false, message: 'Todo 為必填' })
    const newTodo = { id: `qa-${++count}`, content: body.content, createTime: Date.now(), status: false }
    todos.push(newTodo); return send(201, { status: true, newTodo })
  }
  const match = path.match(/^\/todos\/([^/]+)(\/toggle)?$/)
  const todo = match && todos.find(t => t.id === match[1])
  if (todo) {
    if (req.method === 'PUT') { if (!body.content?.trim()) return send(400, { status: false, message: 'Todo 為必填' }); todo.content = body.content }
    else if (req.method === 'PATCH') todo.status = !todo.status
    else if (req.method === 'DELETE') todos = todos.filter(t => t.id !== todo.id)
    else return send(405, { status: false, message: 'Method not allowed' })
    return send(200, { status: true, message: '更新成功' })
  }
  send(404, { status: false, message: 'QA fixture endpoint not found' })
})
server.listen(8095, '127.0.0.1', () => console.log('Local QA API: http://127.0.0.1:8095'))
