// api/chat.ts
// Vercel 自动发现：api/chat.ts → 暴露为 /api/chat
// 完全自包含：没有 Express、没有 import 相对路径，Vercel 一定能 build
import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 仅接受 POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages } = req.body ?? {};

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages 必须是数组" });
  }

  // 设置 SSE 响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // 创建客户端（每次冷启动新建，不在顶层创建以避免 module load 时崩）
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1",
  });

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
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}