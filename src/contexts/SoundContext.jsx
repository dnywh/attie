"use client";
import { createContext, useContext } from "react";
import useSound from "use-sound";

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [play] = useSound("/sounds/scratch.mp3");

  return (
    <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>
  );
}

export function useScoreSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useScoreSound must be used within a SoundProvider");
  }
  return context.play;
}
