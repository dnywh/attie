import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";

import { styled } from "@pigment-css/react";

const StyledRow = styled("li")({
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

function OpponentRow({ team, score, showScore }) {
  return (
    <StyledRow>
      <TeamLogo src={team.crest} />
      <OpponentName>{team.name}</OpponentName>
      <Score score={score} showScore={showScore} />
    </StyledRow>
  );
}

export default OpponentRow;
