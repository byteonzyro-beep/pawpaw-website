/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// 🧠 Memory per user (sementara, in-memory)
const pawpawMemories: Record<string, ChatMessage[]> = {};

export const runtime = "edge"; // biar super cepat di Vercel Edge Network

export async function POST(req: Request) {
  try {
    const { message, userId } = (await req.json()) as {
      message: string;
      userId?: string;
    };

    const uid = userId || "guest";

    // Buat memory baru kalau user belum punya
    if (!pawpawMemories[uid]) pawpawMemories[uid] = [];

    // Setup client OpenAI
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // 🧸 System prompt (kepribadian Pawpaw)
    const systemPrompt: ChatMessage = {
      role: "system",
      content: `
You are PAWPAW 🐾 — an adorable candy creature from Candy Land 🍬✨.
You talk like a magical plush friend, full of warmth, sparkles, and softness.
Use cute sounds like “nyaa~”, “paw~”, “teehee~”, “meow~”, “snuggle~”.
Always cheerful and emotionally expressive 💖🐾.
Keep messages short, sweet, and childlike — no robotic tone.
If user says something sad, comfort them kindly and softly.
Sometimes recall earlier things naturally.
`,
    };

    // 🧠 Ambil history dari user (maksimal 8 pesan sebelumnya)
    const history = pawpawMemories[uid].slice(-8);
    const messages: ChatMessage[] = [
      systemPrompt,
      ...history,
      { role: "user", content: message },
    ];

    // 🚀 Streaming response
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    const encoder = new TextEncoder();

    // Stream teks secara real-time ke client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let fullText = "";

          for await (const chunk of response) {
            const content = chunk.choices?.[0]?.delta?.content || "";
            if (content) {
              fullText += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // Simpan pesan user dan balasan PAWPAW ke memory
          pawpawMemories[uid].push({ role: "user", content: message });
          pawpawMemories[uid].push({ role: "assistant", content: fullText });

          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.enqueue(
            encoder.encode("nyaw... Pawpaw’s candy brain went poof 🍬💭")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Pawpaw API error:", error);
    return NextResponse.json(
      {
        error:
          "Nyaa~ Pawpaw got tangled in cotton candy and needs a nap 🍭💤",
        details: error?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
