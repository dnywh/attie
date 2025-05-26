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
  borderRadius: "50%",
  color: "black",

  // Prepare for isVisible styles
  position: "relative",
  "&::after": {
    transition: `transform 250ms ${theme.curves.spring.heavy}`,
    content: "''",
    borderRadius: "50%",
    height: "100%",
    width: "100%",
    position: "absolute",
  },

  variants: [
    {
      props: { isVisible: false },
      style: {
        cursor: "pointer",
        "&:hover": {
          "&::after": {
            transform: "scale(1.1)",
          },
        },
        "&:active": {
          "&::after": {
            transform: "scale(0.9)",
          },
        },
        "&::after": {
          backgroundColor: "black",
        },
      },
    },
    {
      props: { isVisible: true },
      style: {
        "&::after": {
          // backgroundColor: "white",
          border: "0.5px dashed black",
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
