"use client";
import { useEffect, useState } from "react";

export default function CursorPaw() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[10000000] text-[2rem] select-none transition-transform duration-75 ease-linear drop-shadow-[0_0_15px_rgba(255,128,200,0.8)]"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        filter: "drop-shadow(0 0 8px rgba(255, 150, 200, 0.9))",
      }}
    >
      🐾
    </div>
  );
}
