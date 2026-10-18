# TS Todo - 待辦清單應用

![Node](https://img.shields.io/badge/Node.js-v22.23.3-brightgreen.svg)
![Vue](https://img.shields.io/badge/Vue.js-v3-blue.svg)
![Tailwindcss](https://img.shields.io/badge/Tailwindcss-v3-deepskyblue.svg)

> 輕巧的待辦清單應用，註冊後即可新增、編輯、依狀態查看並完成日常任務。

![TS Todo 登入與帳密帶入入口](public/demo.png)

## 📋 專案概述

此專案以 Vue Composition API 與 TypeScript 開發，練習設計切版、動效和 API 串接。使用 Pinia 管理登入與清單狀態，並透過表單驗證、狀態篩選和鍵盤操作完成日常待辦流程。

**[Demo](https://cutecat8110.github.io/ts-todo/#/login)** · [API 文件](https://todolist-api.hexschool.io/doc/)

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

## 🌸 啟動指南

使用 `.node-version` 指定的 Node 22.23.3：

```sh
npm ci
npm run dev
```

## 使用說明

鑰匙可帶入測試帳號，待辦內容為共用。課程 API 每日凌晨 1:15 清除資料；帳號清除後可由登入流程重建。請勿保存重要或私人資料。

Enter 換行，Ctrl／⌘ + Enter 送出待辦。

<details>
<summary>測試、部署與維護</summary>

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
- `src/config/demo-account.json` 是專用的**公開展示帳號**，供原有鑰匙按鈕帶入；不是管理員帳號，也不包含使用者私人帳密。此帳號的待辦是共用的；目前網站與課程 API 均不提供帳密修改功能。
- [課程 API](https://todolist-api.hexschool.io/doc/) 每日凌晨 1:15 清除資料。展示帳號被清除時，按「登入」會重建該帳號並登入；一般帳號仍使用原本的登入流程。請勿用展示帳號保存重要或私人資料。
- 保留原 Vue／TypeScript、Pinia、Tailwind 與 API 流程。錯誤會顯示可讀訊息，寫入不自動重送；清單讀取失敗可手動重試。
- 一般 Enter 保留換行；Ctrl / ⌘ + Enter 可提交新增或編輯中的待辦。輸入法組字、空白內容及按住快捷鍵不會重複送出。
- `npm run build` 會執行 TypeScript 檢查並輸出 `docs/`；發布使用 `main` 的 `/docs`。預設 `.env` 指向正式 API，發布前確認沒有 `.env.local` 覆寫。

### 隔離 QA

```bash
# 終端一：僅在 127.0.0.1:8095 運作的記憶體 API
npm run qa:api
# 終端二：明確選用本機 API
VITE_BASE_API=http://127.0.0.1:8095 npm run dev -- --host 127.0.0.1
```

Fixture 不會轉送正式 API；重啟會重設資料。Vitest 測試也只使用模擬 fetch，不會改動線上待辦。正式 API 的註冊與 CRUD 另行驗證，測試紀錄清楚分開。

### 素材維護

Google Fonts 保持原字型／字重，載入連結維護於 `index.html`，避免重新加入 CSS @import 造成額外的請求發現等待。介面沒有大型點陣照片，路由分割與 API 邏輯保留。

</details>
