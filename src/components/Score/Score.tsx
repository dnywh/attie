// @ts-nocheck
"use client";
import { useState } from "react";
import { useScoreSound } from "@/contexts/SoundContext";
import { css, styled } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

const hiddenScoreStyles = css`
  cursor: pointer;

  &:hover::after {
    transform: scale(1.1);
  }

  &:active::after {
    transform: scale(0.9);
  }

  &::after {
    background-color: black;
  }
`;

const visibleScoreStyles = css`
  &::after {
    border: 0.5px dashed black;
  }

  & p {
    cursor: default;
    user-select: none;
  }
`;

const Block = styled.div`
  align-items: center;
  border-radius: 50%;
  color: black;
  display: flex;
  flex-shrink: 0;
  height: 2rem;
  justify-content: center;
  position: relative;
  width: 2rem;

  &::after {
    border-radius: 50%;
    content: "";
    height: 100%;
    position: absolute;
    transition: transform 250ms ${webTheme.curves.spring.heavy};
    width: 100%;
  }

  ${({ $isVisible }) => ($isVisible ? visibleScoreStyles : hiddenScoreStyles)}
`;

function Score({ score, showAllScores = false, useSoundEffects }) {
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false);
  const play = useScoreSound();

  const isScoreVisible = showAllScores || hasBeenRevealed;

  const handleReveal = (e) => {
    if (!showAllScores && !hasBeenRevealed) {
      useSoundEffects && play();
      setHasBeenRevealed(true);
    }
  };

  return (
    <Block $isVisible={isScoreVisible} onClick={handleReveal}>
      {isScoreVisible && <p>{score}</p>}
    </Block>
  );
}

export default Score;
