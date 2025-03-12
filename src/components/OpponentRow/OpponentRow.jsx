import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";
import { styled } from "@pigment-css/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";

const StyledOpponentRow = styled("li")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "0.625rem",

  "&:not(:last-child)": {
    borderWidth: "1px",
    padding: "0.85rem 0.85rem 0.525rem 0.85rem",
  },

  "&:last-child": {
    borderWidth: "0 1px 1px 1px",
    padding: "0.525rem 0.85rem 0.85rem 0.85rem",
  },
});

const OpponentName = styled("p")(({ theme }) => ({
  flex: "1",
  ...teamText,
  ...ellipsizedText,
}));

function OpponentRow({
  team,
  score,
  showAllScores,
  status,
  isHomeTeam,
  useSoundEffects,
}) {
  return (
    <StyledOpponentRow>
      <TeamLogo
        src={team.crest}
        alt={`Crest for ${team.shortName ? team.shortName : team.name}`}
        isHomeTeam={isHomeTeam}
      />
      <OpponentName>{team.shortName ? team.shortName : team.name}</OpponentName>
      {!["SCHEDULED", "TIMED", "CANCELLED", "POSTPONED"].includes(status) && (
        <Score
          score={score}
          showAllScores={showAllScores}
          useSoundEffects={useSoundEffects}
        />
      )}
    </StyledOpponentRow>
  );
}

export default OpponentRow;
