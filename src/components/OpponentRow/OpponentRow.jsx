"use client";
import { useState, useEffect } from "react";
import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";
import { styled } from "@pigment-css/react";

const StyledOpponentRow = styled("li")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
  borderColor: "black",
  borderStyle: "solid",

  "&:not(:last-child)": {
    borderWidth: "1px",
  },

  "&:last-child": {
    borderWidth: "0 1px 1px 1px",
  },
});

const OpponentName = styled("p")({
  flex: "1",
  lineHeight: "100%",
});

function OpponentRow({ team, score, showAllScores }) {
  return (
    <StyledOpponentRow>
      <TeamLogo src={team.crest} />
      <OpponentName>{team.name}</OpponentName>
      <Score score={score} showAllScores={showAllScores} />
    </StyledOpponentRow>
  );
}

export default OpponentRow;
