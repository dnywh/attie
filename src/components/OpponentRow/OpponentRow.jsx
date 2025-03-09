import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";
import { styled } from "@pigment-css/react";

const StyledOpponentRow = styled("li")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",

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
  textTransform: "uppercase",
  letterSpacing: "0.025rem",
  fontWeight: "500",
});

function OpponentRow({ team, score, showAllScores, status }) {
  return (
    <StyledOpponentRow>
      <TeamLogo src={team.crest} />
      <OpponentName>{team.name}</OpponentName>
      {!["SCHEDULED", "TIMED", "CANCELLED", "POSTPONED"].includes(status) && (
        <Score score={score} showAllScores={showAllScores} />
      )}
    </StyledOpponentRow>
  );
}

export default OpponentRow;
