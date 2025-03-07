"use client";
import { useState, useEffect } from "react";
import { styled } from "@pigment-css/react";

const Block = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "2rem",
  height: "2rem",
  backgroundColor: "black",
  color: "black",
  borderRadius: "50%",

  "&:hover": {
    transform: "scale(1.1)",
    cursor: "pointer",
  },

  variants: [
    {
      props: { isVisible: true },
      style: {
        backgroundColor: "white",
        border: "0.5px dashed black",
      },
    },
  ],
});

function Score({ score, showAllScores = false, showFixtureScores = false }) {
  const [showLocalScore, setShowLocalScore] = useState(false);

  // Reset local score when higher-level visibility changes
  useEffect(() => {
    if (showAllScores || showFixtureScores) {
      setShowLocalScore(false);
    }
  }, [showAllScores, showFixtureScores]);

  const isScoreVisible = showAllScores || showFixtureScores || showLocalScore;

  const handleShowOrHideScore = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!showAllScores && !showFixtureScores) {
      setShowLocalScore(!showLocalScore);
    }
  };

  return (
    <Block
      isVisible={isScoreVisible}
      onClick={handleShowOrHideScore}
      style={{
        cursor: showAllScores || showFixtureScores ? "default" : "pointer",
      }}
    >
      {isScoreVisible && score}
    </Block>
  );
}

export default Score;
