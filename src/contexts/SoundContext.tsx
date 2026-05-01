"use client";
import { createContext, useContext, type ReactNode } from "react";
import useSound from "use-sound";

type PlaySound = () => void;

const SoundContext = createContext<{ play: PlaySound } | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [play] = useSound("/sounds/scratch.mp3");

  return (
    <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>
  );
}

export function useScoreSound(): PlaySound {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useScoreSound must be used within a SoundProvider");
  }
  return context.play;
}
