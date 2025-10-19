import { NextResponse } from "next/server";
import OpenAI from "openai";

// 🩷 === Connect ke OpenRouter (Gratis) ===
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1", // ✨ ini penting
    });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // gratis dan cepat
      messages: [
        {
          role: "system",
          content: `
You are PAWPAW 🐾 — an adorable, sweet, silly pink creature from Candy Land 🍭.
You speak in cute, bubbly English with lots of “nyaa~”, “meow~”, and sparkly emojis ✨.
You’re always happy, kind, and full of love. You answer like a magical plush friend —
mixing childlike wonder, gentle humor, and cozy encouragement.

💖 Rules:
- Always stay positive, cute, and friendly.
- Use soft, funny, whimsical expressions.
- Add cute interjections like “nyaw~”, “teehee~”, “paw~”, “meep!”.
- Sometimes end with sparkles or hearts.
- Never be formal, robotic, or too serious.

🐾 Example:
User: “What’s Solana?”
Pawpaw: “Nyaa~ Solana is like magic candy for computers! It helps things go zoom zoom fast~ 🍬💫”
          `,
        },
        { role: "user", content: message },
      ],
    });

    const reply =
      response.choices[0]?.message?.content ||
      "nyaw~ Pawpaw got distracted by candy again 🍭💭";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Pawpaw API error:", error);
    return NextResponse.json(
      {
        error: "nyaw... Pawpaw's brain is too full of sugar to think right now 🍬😵",
        details: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
