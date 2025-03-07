"use client";
import { useState, useEffect } from "react";
import { styled } from "@pigment-css/react";

const Block = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "2rem",
  height: "2rem",
  color: "black",
  borderRadius: "50%",
  transition: "transform 0.125s ease-in-out",

  variants: [
    {
      props: { isVisible: false },
      style: {
        cursor: "pointer",
        backgroundColor: "black",
        "&:hover": {
          transform: "scale(1.1)",
        },
      },
    },
    {
      props: { isVisible: true },
      style: {
        backgroundColor: "white",
        border: "0.5px dashed black",

        "& p": {
          userSelect: "none",
          cursor: "default",
        },
      },
    },
  ],
});

function Score({ score, showAllScores = false }) {
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false);

  // Reset local state when showAllScores changes to false
  useEffect(() => {
    if (!showAllScores) {
      setHasBeenRevealed(false);
    }
  }, [showAllScores]);

  const isScoreVisible = showAllScores || hasBeenRevealed;

  const handleReveal = (e) => {
    if (!showAllScores && !hasBeenRevealed) {
      setHasBeenRevealed(true);
    }
  };

  return (
    <Block
      isVisible={isScoreVisible}
      onClick={!isScoreVisible ? handleReveal : undefined}
    >
      {isScoreVisible && <p>{score}</p>}
    </Block>
  );
}

export default Score;
