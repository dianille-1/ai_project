// src/server.ts
// Express 后端：转发请求到 DeepSeek，并把流式结果通过 SSE 推给浏览器
// Vercel 部署：导出 app，由 vercel.json + @vercel/node 当 Serverless 函数跑
// 本地开发：tsx src/server.ts，正常 listen
import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 托管 public/ 下的静态文件

// 检查 API Key 是否设置（缺失时给出明确指引，不让 OpenAI 抛莫名错）
if (!process.env.DEEPSEEK_API_KEY) {
  console.error("\n❌ DEEPSEEK_API_KEY 未设置");
  console.error("   本地：在项目根目录创建 .env 文件，写入 DEEPSEEK_API_KEY=sk-你的key");
  console.error("   Vercel：在 Project Settings → Environment Variables 添加该变量\n");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

// 聊天接口
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages 必须是数组" });
  }

  // 设置 SSE 响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await client.chat.completions.create({
      model: "deepseek-chat",
      max_tokens: 1024,
      stream: true,
      messages,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        // 每拿到一段文字就推给浏览器
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// 本地开发才启动监听；Vercel 上以 Serverless 函数形式运行，不 listen
if (process.env.VERCEL !== "1") {
  const PORT = Number(process.env.PORT) || 3001;
  app.listen(PORT, () => {
    console.log(`\n✅ 服务已启动: http://localhost:${PORT}`);
    console.log(`📱 浏览器打开 http://localhost:${PORT} 即可使用\n`);
  });
}

export default app;