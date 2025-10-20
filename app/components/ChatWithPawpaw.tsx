"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ChatWithPawpaw() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("pawpaw_user") ||
          (() => {
            const id = `paw-${Math.random().toString(36).slice(2)}`;
            localStorage.setItem("pawpaw_user", id);
            return id;
          })()
        : "guest";

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let partial = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partial += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: partial }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Nyaa~ Pawpaw’s candy brain froze 🧊💔" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="chat"
      className="relative flex flex-col items-center justify-center w-full py-12 text-center"
    >
      {/* 🌸 Panel utama */}
      <div
        className="ca-panel cursor-none select-none px-10 py-6 rounded-2xl backdrop-blur-xl 
                   bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(255,150,210,0.3)] 
                   hover:shadow-[0_0_60px_rgba(255,180,240,0.6)] transition-all duration-300
                   flex flex-col items-center"
      >
        {/* 💖 Judul */}
        <h3
          className="ca-text text-lg md:text-2xl font-extrabold tracking-wider text-center mb-4
                     bg-gradient-to-b from-[#fff5cc] via-[#ffd700] to-[#ffb6d9]
                     bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(255,190,120,0.8)]"
        >
          🐾 CHAT WITH PAWPAW 💬
        </h3>

        {/* ✨ Pawpaw Avatar */}
        <motion.div
          className="relative w-[120px] h-[120px] mb-6"
          animate={{
            y: loading ? [0, -5, 0] : 0,
            rotate: loading ? [0, 2, -2, 0] : 0,
          }}
          transition={{
            duration: loading ? 1.2 : 0.6,
            repeat: loading ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <Image
            src={loading ? "/images/candy5.png" : "/images/candy8.png"}
            alt="Pawpaw"
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(255,180,240,0.7)]"
          />
        </motion.div>

        {/* 💬 Chat box */}
        <div
          className="w-[95%] md:w-[700px] bg-white/10 backdrop-blur-xl rounded-3xl 
                     border border-white/20 shadow-[0_0_30px_rgba(255,180,240,0.4)] p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 animate-shimmer pointer-events-none"></div>

          {/* Chat Messages */}
          <div className="mb-4 flex flex-col gap-3 max-h-[420px] overflow-y-auto text-left px-2 relative z-10">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative p-3 rounded-2xl max-w-[80%] ${
                  msg.role === "user"
                    ? "self-end bg-pink-300/60 text-right text-pink-900"
                    : "self-start bg-white/30 text-pink-800"
                }`}
              >
                {msg.content}

                {msg.role === "assistant" && (
                  <motion.span
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  ></motion.span>
                )}
              </motion.div>
            ))}

            {/* 🍭 Pawpaw Thinking */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="self-start bg-white/30 text-pink-700 rounded-2xl px-4 py-2 text-sm italic"
                >
                  💭 Pawpaw is thinking... maybe about candy~ 🍬
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="flex mt-4 relative z-10">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say something sweet to Pawpaw..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-2xl px-4 py-2 bg-white/20 text-pink-100 placeholder:text-pink-200 
                         focus:outline-none border border-white/30"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="ml-2 px-5 py-2 rounded-2xl 
                         bg-gradient-to-r from-[#fff5cc] via-[#ffd700] to-[#ffb6d9]
                         text-transparent bg-clip-text border border-[#ffd6f0] 
                         font-extrabold tracking-wider shadow-[0_0_25px_rgba(255,200,240,0.6)] 
                         hover:scale-105 transition-all duration-200"
            >
              {loading ? "..." : "Send 💌"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
