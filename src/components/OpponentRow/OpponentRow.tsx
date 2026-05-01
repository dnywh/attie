import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";
import { css, styled } from "next-yak";
import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import { webTheme } from "@/styles/theme.yak";
import type { CommonFixture, ScoreValue, StatusObject } from "@/types/domain";

const StyledOpponentRow = styled.li`
  align-items: center;
  display: flex;
  gap: 0.625rem;
  justify-content: space-between;

  &:not(:last-child) {
    border-width: 1px;
    padding: 0.85rem 0.85rem 0.525rem;
  }

  &:last-child {
    border-width: 0 1px 1px;
    padding: 0.525rem 0.85rem 0.85rem;
  }
`;

const knownNameStyles = css`
  color: ${webTheme.colors.text.primary};
`;

const unknownNameStyles = css`
  color: ${webTheme.colors.text.tertiary};
`;

const OpponentName = styled.p<{ $isKnown: boolean }>`
  ${teamText};
  ${ellipsizedText};
  flex: 1;
  ${({ $isKnown }) => ($isKnown ? knownNameStyles : unknownNameStyles)}
`;

interface OpponentRowProps {
  team: CommonFixture["homeTeam"];
  score: ScoreValue;
  showAllScores: boolean;
  status: StatusObject;
  isHomeTeam: boolean;
  useSoundEffects: boolean;
}

function OpponentRow({
  team,
  score,
  showAllScores,
  status,
  isHomeTeam,
  useSoundEffects,
}: OpponentRowProps) {
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
  ].some((scoreStatus) => scoreStatus === status.type);

  return (
    <StyledOpponentRow>
      <TeamLogo
        isKnown={isKnown}
        src={team.crest}
        alt={`Crest for ${teamName}`}
        isHomeTeam={isHomeTeam}
      />
      <OpponentName $isKnown={isKnown}>{teamName}</OpponentName>
      {shouldShowScoreComponent && (
        <Score
          key={showAllScores ? "all-scores" : "hidden-scores"}
          score={score}
          showAllScores={showAllScores}
          useSoundEffects={useSoundEffects}
        />
      )}
    </StyledOpponentRow>
  );
}

export default OpponentRow;
