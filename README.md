# TS Todo - 待辦清單應用

![Node](https://img.shields.io/badge/Node.js-v22.23.3-brightgreen.svg)
![Vue](https://img.shields.io/badge/Vue.js-v3-blue.svg)
![Tailwindcss](https://img.shields.io/badge/Tailwindcss-v3-deepskyblue.svg)

> 輕巧的待辦清單應用，註冊後即可新增、編輯並完成日常任務。

![TS Todo 登入與帳密帶入入口](public/demo.png)

## 📋 專案概述

此專案以 Vue Composition API 與 TypeScript 開發，練習設計切版、動效和 API 串接。使用 Pinia 管理登入與清單狀態，並透過表單驗證、完成進度和鍵盤操作完成日常待辦流程。

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
