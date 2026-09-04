// src/first-call.ts
// 用 DeepSeek (OpenAI 兼容协议) 发起第一次 AI 调用
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

async function main() {
  console.log("📡 正在向 DeepSeek 发送请求...\n");

  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 256,
    messages: [
      { role: "user", content: "用一句话介绍 JavaScript 的闭包" }
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  console.log("🤖 AI 说:", text);
  console.log("\n📊 这次调用:");
  console.log("  输入 token:", completion.usage?.prompt_tokens);
  console.log("  输出 token:", completion.usage?.completion_tokens);
  console.log("  模型:", completion.model);
}

main().catch((err) => {
  console.error("❌ 出错了:", err.message);
  if (err.status) console.error("HTTP status:", err.status);
  process.exit(1);
});