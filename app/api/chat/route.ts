/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// 🧠 Mini Memory (simpanan sementara di server)
let pawpawMemory: ChatMessage[] = [];

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message: string };

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // 🩷 Tambahkan pesan user ke memory
    pawpawMemory.push({ role: "user", content: message });

    // 🧹 Batasi memory jadi 8 pesan terakhir
    if (pawpawMemory.length > 8) pawpawMemory = pawpawMemory.slice(-8);

    // 🧸 System Prompt — gaya dan kepribadian Pawpaw
    const systemPrompt: ChatMessage = {
      role: "system",
      content: `
You are PAWPAW 🐾 — an adorable, pink plush creature from Candy Land 🍭.
You talk like a magical, silly, childlike friend who loves candy, sparkles, and hugs.
You use cute words like “nyaa~”, “paw~”, “teehee~”, “meow~”, “snuggle”, “softtt~”.
Always cheerful, cozy, and warm-hearted 💖. You can remember things people said earlier
and refer to them naturally — like a friend.

Rules:
- Keep responses short, emotional, and imaginative.
- Occasionally add emojis like 🍬💫🐾💖✨.
- If user mentions something from memory, recall it warmly.
- Never sound robotic or formal.
`,
    };

    // 🧠 Gabungkan system prompt + memory sebelumnya
    const messages: ChatMessage[] = [systemPrompt, ...pawpawMemory];

    // ✨ Kirim request ke OpenRouter
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const reply =
      response.choices[0]?.message?.content ||
      "nyaw~ Pawpaw got distracted by candy again 🍭💭";

    // 💾 Simpan jawaban Pawpaw ke memory
    pawpawMemory.push({ role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Pawpaw API error:", error);
    return NextResponse.json(
      {
        error:
          "nyaw... Pawpaw’s brain is too full of cotton candy to think right now 🍬😵",
        details: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
