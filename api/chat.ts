// api/chat.ts
// Vercel 自动发现：api/chat.ts → 暴露为 /api/chat
// 不再用 catch-all rewrite，让 Vercel 自己处理路由
import app from "../src/server";

export default app;