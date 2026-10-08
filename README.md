# TS Todo - 待辦清單應用

![Node](https://img.shields.io/badge/Node.js-v22.23.3-brightgreen.svg)
![Vue](https://img.shields.io/badge/Vue.js-v3-blue.svg)
![Tailwindcss](https://img.shields.io/badge/Tailwindcss-v3-deepskyblue.svg)

> 這是一款「輕巧實用」的待辦清單應用，讓你能輕鬆地管理日常事務。只需註冊，即可建立、追蹤並完成待辦任務，讓你更專注於工作和生活。

![](https://cutecat8110.github.io/ts-todo/demo.png)

## 📋 專案概述

此專案旨在提升 Vue Composition API + TypeScript 技術熟練度，強調簡潔且有效的用戶介面設計。<br />專案是獨立開發的，包含設計切版、動效實現和 API 串接等，最終目標是建立一個包含用戶註冊和待辦任務等基本功能的應用程式。

- [API 文件](https://todolist-api.hexschool.io/doc/)
- [Demo](https://cutecat8110.github.io/ts-todo/)

## 🌸 啟動、測試與部署

使用 `.node-version` 指定的 Node 22.23.3：

```bash
npm ci
# .env 已包含公開 API 網址；需要其他環境時可從範例建立 .env.local
npm run dev
npm run test
npm run type-check
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

- `VITE_BASE_API` 為六角學院 API 根網址。`VITE_*` 都會進入公開建置，不能放入私人憑證。
- `src/config/demo-account.json` 是專用的**公開展示帳號**，供原有鑰匙按鈕帶入；不是管理員帳號，也不包含使用者私人帳密。此帳號的待辦是共用的。
- 保留原 Vue／TypeScript、Pinia、Tailwind 與 API 流程。錯誤會顯示可讀訊息，寫入不自動重送；清單讀取失敗可手動重試。
- 一般 Enter 保留換行；Ctrl / ⌘ + Enter 可提交新增或編輯中的待辦。輸入法組字、空白內容及按住快捷鍵不會重複送出。
- `npm run build` 會執行 TypeScript 檢查並輸出 `docs/`；發布使用 `portfolio/qa` 的 `/docs`。預設 `.env` 指向正式 API，發布前確認沒有 `.env.local` 覆寫。
- 回復部署時，將 GitHub Pages 改回 `main`、`/docs`；本輪原始提交為 `595a4ce68c91ed4846348fe734f0bd86ee123870`。

### 隔離 QA

```bash
# 終端一：僅在 127.0.0.1:8095 運作的記憶體 API
npm run qa:api
# 終端二：明確選用本機 API
VITE_BASE_API=http://127.0.0.1:8095 npm run dev -- --host 127.0.0.1
```

Fixture 不會轉送正式 API；重啟會重設資料。Vitest 測試也只使用模擬 fetch，不會改動線上待辦。正式 API 的註冊與 CRUD 另行驗證，測試紀錄清楚分開。

修正編號、兩輪 QA 結果、RWD 量測與已知限制：[QA_CHANGELOG.md](QA_CHANGELOG.md)。

## 🔨 核心技術

<table>
    <tbody>
    <tr>
        <td>
        <a href="https://vuejs.org/"> Vue 3 </a>
        </td>
        <td>JavaScript 框架</td>
    </tr>
    <tr>
        <td>
        <a href="https://www.typescriptlang.org/"> TypeScript </a>
        </td>
        <td>JavaScript 的超集</td>
    </tr>
    <tr>
        <td>
        <a href="https://pinia.vuejs.org/"> Pinia </a>
        </td>
        <td>Vue.js 的狀態管理庫</td>
    </tr>
    <tr>
        <td>
        <a href="https://tailwindcss.com/"> Tailwind CSS </a>
        </td>
        <td>CSS 框架</td>
    </tr>
    </tbody>
</table>

<br />

## 🛠️ 擴展套件

<table>
    <tbody>
    <tr>
        <td>
        <a href="https://sweetalert2.github.io/"> SweetAlert 2 </a>
        </td>
        <td>可定製訊息彈框</td>
    </tr>
    <tr>
        <td>
        <a href="https://vee-validate.logaretm.com/v4/"> VeeValidate </a>
        </td>
        <td>表單驗證庫</td>
    </tr>
    <tr>
        <td>
        <a href="https://day.js.org/"> Day.js </a>
        </td>
        <td>輕量級日期和時間處理庫</td>
    </tr>
    <tr>
        <td>
        <a href="https://vueuse.org/"> VueUse </a>
        </td>
        <td>Vue 3 Composition API 的實用函數庫</td>
    </tr>
    <tr>
        <td>
        <a href="https://iconify.design/"> Iconify </a>
        </td>
        <td>大量開源向量圖標</td>
    </tr>
    </tbody>
</table>
