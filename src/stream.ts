// src/stream.ts
// 流式调用 DeepSeek，逐字看到 AI 输出
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

async function main() {
  console.log("🤖 AI: ");

  const stream = await client.chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 512,
    stream: true,
    messages: [
      { role: "user", content: "用三句话介绍 JavaScript 的事件循环" }
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    process.stdout.write(delta); // 不换行，逐字输出
  }

  console.log("\n\n✅ 完成");
}

main().catch((err) => {
  console.error("\n❌ 出错了:", err.message);
  if (err.status) console.error("HTTP status:", err.status);
  process.exit(1);
});