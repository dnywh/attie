"use client";
import { useState, useEffect } from "react";
import { useScoreSound } from "@/contexts/SoundContext";
import { styled } from "@pigment-css/react";

const Block = styled("div")(({ theme }) => ({
  flexShrink: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "2rem",
  height: "2rem",
  color: "black",
  borderRadius: "50%",
  transition: `transform 180ms ${theme.curves.spring.heavy}`,
  "&:hover": {
    transform: "scale(1.1)",
  },
  "&:active": {
    transform: "scale(0.9)",
  },

  variants: [
    {
      props: { isVisible: false },
      style: {
        cursor: "pointer",
        backgroundColor: "black",
      },
    },
    {
      props: { isVisible: true },
      style: {
        backgroundColor: "white",
        border: "0.5px dashed black",
        "&:hover, &:active": {
          transform: "unset",
        },

        "& p": {
          userSelect: "none",
          cursor: "default",
        },
      },
    },
  ],
}));

function Score({ score, showAllScores = false, useSoundEffects }) {
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false);
  const play = useScoreSound();

  // Reset local state when showAllScores changes to false
  useEffect(() => {
    if (!showAllScores) {
      setHasBeenRevealed(false);
    }
  }, [showAllScores]);

  const isScoreVisible = showAllScores || hasBeenRevealed;

  const handleReveal = (e) => {
    if (!showAllScores && !hasBeenRevealed) {
      useSoundEffects && play();
      setHasBeenRevealed(true);
    }
  };

  return (
    <Block isVisible={isScoreVisible} onClick={handleReveal}>
      {isScoreVisible && <p>{score}</p>}
    </Block>
  );
}

export default Score;
