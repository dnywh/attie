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
  fontSize: "0.9375rem", // 15px
  letterSpacing: "0.035em",
  textTransform: "uppercase",
  fontWeight: "500",
  // Truncate and ellipsize text
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

function OpponentRow({ team, score, showAllScores, status, isHomeTeam }) {
  return (
    <StyledOpponentRow>
      <TeamLogo
        src={team.crest}
        alt={`Crest for ${team.shortName ? team.shortName : team.name}`}
        isHomeTeam={isHomeTeam}
      />
      <OpponentName>{team.shortName ? team.shortName : team.name}</OpponentName>
      {!["SCHEDULED", "TIMED", "CANCELLED", "POSTPONED"].includes(status) && (
        <Score score={score} showAllScores={showAllScores} />
      )}
    </StyledOpponentRow>
  );
}

export default OpponentRow;
