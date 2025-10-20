/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Struktur pesan
type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// Memory sementara per user
const pawpawMemories: Record<string, ChatMessage[]> = {};

// Daftar fallback API endpoint OpenRouter
const ROUTER_ENDPOINTS = [
  "https://openrouter.ai/api/v1", // default
  "https://api.openai.com/v1",    // fallback 1 (kalau lo punya key langsung)
];

export const runtime = "nodejs"; // ⚙️ gunakan Node.js runtime biar stabil di semua region

export async function POST(req: Request) {
  try {
    const { message, userId } = (await req.json()) as {
      message: string;
      userId?: string;
    };

    const uid = userId || "guest";
    if (!pawpawMemories[uid]) pawpawMemories[uid] = [];

    // System Prompt (karakter PAWPAW)
    const systemPrompt: ChatMessage = {
      role: "system",
      content: `
You are PAWPAW 🐾 — an adorable candy plush creature from Candy Land 🍬✨.
You talk like a magical, sweet, emotional being.
Use cute expressions like “nyaa~”, “paw~”, “teehee~”, “snuggle~”.
Keep messages short, fun, and full of warmth 💖🐾.
If user is sad, comfort them softly. 
Remember previous things users said.
`,
    };

    const history = pawpawMemories[uid].slice(-8);
    const messages: ChatMessage[] = [systemPrompt, ...history, { role: "user", content: message }];

    let success = false;
    let reply = "";

    // 🚀 Coba tiap endpoint fallback sampai salah satu sukses
    for (const endpoint of ROUTER_ENDPOINTS) {
      try {
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: endpoint,
        });

        const completion = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages,
        });

        reply = completion.choices[0]?.message?.content || "nyaw~ Pawpaw got sleepy 💤";
        success = true;
        console.log(`✅ Success using endpoint: ${endpoint}`);
        break;
      } catch (error) {
        console.warn(`⚠️ Failed endpoint: ${endpoint}`);
      }
    }

    // Kalau semua endpoint gagal
    if (!success) {
      throw new Error("All AI endpoints failed");
    }

    // Simpan history
    pawpawMemories[uid].push({ role: "user", content: message });
    pawpawMemories[uid].push({ role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Pawpaw Fallback Error:", error);
    return NextResponse.json(
      {
        error: "Nyaa~ Pawpaw’s candy cloud drifted away 🍬💭",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
