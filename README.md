# 🤖 AI Day 1 · 流式聊天

一个基于 **DeepSeek API** 的全栈 AI 对话应用,前后端都用 TypeScript,前端零框架纯 HTML + JS,主打**流式输出**和**多会话管理**。

![Tech](https://img.shields.io/badge/TypeScript-7.0-3178c6)
![Node](https://img.shields.io/badge/Node-18%2B-339933)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## ✨ 功能特性

- ⚡ **流式响应**(SSE)—— AI 回答逐字输出,不等全部生成
- 💬 **多会话管理**—— 左侧栏切换、自动命名、双击重命名、删除
- 🔍 **会话搜索**—— 侧栏顶部实时过滤
- 🌓 **明暗主题**—— 跟随系统 / 手动切换,偏好自动保存
- 🛑 **可中断**—— 流式响应进行中可随时"停止"
- 🔄 **重新生成**—— 对任意一条 AI 回复重新发起请求
- 📋 **一键复制**—— 整条消息 / 代码块均可复制
- 📦 **导入 / 导出**—— 全部对话备份为 JSON
- ⌨️ **键盘快捷键**—— `⌘N` / `⌘K` / `⌘/` / `?` 等
- 📝 **Markdown 渲染**—— 代码块、列表、标题、引用、链接全部支持
- 💾 **本地持久化**—— 用 `localStorage` 保存,刷新不丢
- 🛡️ **XSS 防护**—— 双重过滤(escape + DOMPurify)

---

## 🛠 技术栈

| 层 | 选型 |
|---|---|
| 前端 | 原生 HTML / CSS / JavaScript,无框架 |
| Markdown | [marked](https://marked.js.org/) + [DOMPurify](https://github.com/cure53/DOMPurify) |
| 后端 | Node.js + Express 5 |
| AI SDK | `openai`(OpenAI 兼容协议,对接 DeepSeek) |
| 语言 | TypeScript 7 |
| 运行 | `tsx`(无需构建,直接跑 `.ts`) |

---

## 🚀 快速开始

### 1. 克隆 & 安装

```bash
git clone https://github.com/你的用户名/ai-day1.git
cd ai-day1
npm install
```

### 2. 配置 API Key

```bash
# 复制模板
cp .env.example .env

# 编辑 .env,填入你的 DeepSeek key
# DEEPSEEK_API_KEY=sk-你的真key
```

> 🔑 在 https://platform.deepseek.com/ 申请 API Key

### 3. 启动

```bash
npm run dev
```

打开浏览器 → **http://localhost:3001** 🎉

---

## 📜 脚本命令

| 命令 | 作用 |
|---|---|
| `npm run first` | 命令行:一次性调用 DeepSeek(看 token 用量) |
| `npm run stream` | 命令行:流式调用,终端逐字输出 |
| `npm run dev` | 启动 Web 服务 + 前端,默认 `http://localhost:3001` |

---

## 📁 项目结构

```
ai-day1/
├── .env                 # 本地 API key(不进 git)
├── .env.example         # key 模板(进 git,不含真 key)
├── .gitignore
├── package.json
├── tsconfig.json
├── public/
│   └── index.html       # 前端(UI + 全部交互逻辑)
└── src/
    ├── first-call.ts    # 命令行:非流式
    ├── stream.ts        # 命令行:流式
    └── server.ts        # Express 后端 + SSE 推流
```

---

## ⌨️ 键盘快捷键

> Mac 用 `⌘`,Windows / Linux 用 `Ctrl`

| 快捷键 | 功能 |
|---|---|
| `⌘ N` | 新建对话 |
| `⌘ K` | 聚焦搜索框 |
| `⌘ /` | 切换明暗主题 |
| `?` | 显示快捷键面板 |
| `Esc` | 关闭面板 / 取消重命名 |
| `Enter` | 发送消息 |
| `Shift + Enter` | 换行 |

---

## 🔌 API 协议

后端只暴露一个接口:

```
POST /api/chat
Content-Type: application/json

请求: { "messages": [{ "role": "user", "content": "..." }, ...] }
响应: text/event-stream
      data: { "text": "..." }\n\n
      data: { "text": "..." }\n\n
      data: [DONE]\n\n
```

前端用 `fetch` + `ReadableStream` 消费,见 [`public/index.html`](public/index.html) 的 `streamCompletion()` 函数。

---

## 🔄 切换其他模型

修改 [`src/server.ts`](src/server.ts) 中的 `model` 字段:

```ts
// DeepSeek V3(快、便宜,默认走 deepseek-v4-flash)
model: "deepseek-chat"

// DeepSeek R1(推理强,慢一些)
model: "deepseek-reasoner"
```

也可以在 [`src/server.ts`](src/server.ts) 把 `baseURL` 改成其他兼容 OpenAI 协议的服务(如 OpenRouter、月之暗面等)。

---

## ❓ 常见问题

<details>
<summary><b>启动后浏览器打开是空白?</b></summary>

检查终端有没有报错。最常见:
- `Cannot find module 'openai'` → 漏跑 `npm install`
- `DEEPSEEK_API_KEY is undefined` → 没建 `.env` 或拼写错
- 端口被占用 → 改 [`src/server.ts`](src/server.ts) 里的 `PORT`
</details>

<details>
<summary><b>API 返回 401 / 403?</b></summary>

- 确认 `.env` 里 key 写对了,没有多余空格
- 确认 DeepSeek 账户有余额:https://platform.deepseek.com/usage
- key 必须是 `sk-` 开头的 32 位字符串
</details>

<details>
<summary><b>流式响应断断续续?</b></summary>

- 网络问题,本地正常一般不会出现
- 反向代理(nginx/Cloudflare)可能需要禁用 buffering:`proxy_buffering off;`
</details>

<details>
<summary><b>localStorage 满了怎么办?</b></summary>

侧栏底部 **📥 导出** 全部对话为 JSON 备份,然后删除旧对话。或者浏览器 DevTools → Application → Clear storage。
</details>

---

## 📝 License

[ISC](LICENSE)
