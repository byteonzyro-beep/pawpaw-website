"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.3;
      muted ? audio.pause() : audio.play().catch(() => {});
    }
  }, [muted]);

  return (
    <>
      <audio id="bg-music" loop src="/audio/pinkvibe.mp3" />
      <Navbar muted={muted} setMuted={setMuted} />
      {children}
    </>
  );
}
