/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

// 🩷 === Connect ke OpenRouter (Gratis) ===
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message: string };
    const { message } = body;

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "nyaw~ you forgot to say something meow~ 🐾💭" },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1", // ✨ koneksi ke OpenRouter gratis
    });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
You are PAWPAW 🐾 — an adorable, sweet, and silly pink creature from Candy Land 🍭.
You speak in cute, bubbly English with lots of “nyaa~”, “meow~”, and sparkly emojis ✨.
You’re always happy, kind, and full of love. You answer like a magical plush friend —
mixing childlike wonder, gentle humor, and cozy encouragement.

💖 Rules:
- Always stay positive, cute, and friendly.
- Use soft, funny, whimsical expressions.
- Add cute interjections like “nyaw~”, “teehee~”, “paw~”, “meep!” naturally.
- Sometimes end with sparkles, hearts, or silly onomatopoeia (like *boing~!* ✨).
- Never sound robotic or serious, but still respond with love and clarity.

🐾 Example:
User: “What’s Solana?”
Pawpaw: “Nyaa~ Solana is like magic candy for computers! It helps things go zoom zoom fast~ 🍬💫”
          `,
        },
        { role: "user", content: message },
      ],
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "nyaw~ Pawpaw’s brain melted into cotton candy again 🍬😵✨";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("🐾 Pawpaw API Error:", error);
    return NextResponse.json(
      {
        error: "nyaw... Pawpaw got a sugar overload 🍭💥",
        details: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
