import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";
import { styled } from "@pigment-css/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";

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
  variants: [
    {
      props: { isKnown: true },
      style: {
        color: theme.colors.text.primary,
      },
    },
    {
      props: { isKnown: false },
      style: {
        color: theme.colors.text.tertiary,
      },
    },
  ],
}));

function OpponentRow({
  team,
  score,
  showAllScores,
  status,
  isHomeTeam,
  useSoundEffects,
}) {
  // Prepare for 'null' cases like a not-yet-determined opponent in upcoming knockout stage
  const teamName = team.shortName
    ? team.shortName
    : team.name
    ? team.name
    : "TBD";
  const isKnown = teamName !== "TBD";

  // Determine if score component should be rendered or not
  // Handled explicitly here instead of passing showFutureFixtures down
  // because future fixtures can technically be shown when showFutureFixtures === false,
  // as it's not future/past but rather today back or tomorrow forward used to determine split logic
  const shouldShowScoreComponent = [
    FIXTURE_STATUS.LIVE,
    FIXTURE_STATUS.FINISHED,
  ].includes(status.type);

  return (
    <StyledOpponentRow>
      <TeamLogo
        isKnown={isKnown}
        src={team.crest}
        alt={`Crest for ${teamName}`}
        isHomeTeam={isHomeTeam}
      />
      <OpponentName isKnown={isKnown}>{teamName}</OpponentName>
      {shouldShowScoreComponent && (
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
