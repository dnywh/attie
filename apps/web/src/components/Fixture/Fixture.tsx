import FixtureStatus from "@/components/FixtureStatus";
import OpponentRow from "@/components/OpponentRow";
import { styled } from "next-yak";
import { smallText, cardStippledBackground } from "@/styles/commonStyles";
import { webTheme } from "@/styles/theme.yak";
import type { CommonFixture } from "@/types/domain";

const FixtureRow = styled.li`
  ${cardStippledBackground};
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 3px;
  box-shadow: 0 3px 0 0 black;
  color: ${webTheme.colors.text.primary};
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.65rem;

  &:not(:last-of-type) {
    position: relative;

    &::before {
      background: linear-gradient(
        to right,
        transparent 34px,
        black 0,
        black 36px,
        ${webTheme.colors.background.interstitial} 0,
        ${webTheme.colors.background.interstitial} 48px,
        black 0,
        black 54px,
        transparent 0,
        transparent calc(100% - 54px),
        black 0,
        black calc(100% - 48px),
        ${webTheme.colors.background.interstitial} 0,
        ${webTheme.colors.background.interstitial} calc(100% - 36px),
        black 0,
        black calc(100% - 34px),
        transparent 0
      );
      content: "";
      height: calc(1.5rem - 3px);
      left: 0;
      position: absolute;
      top: calc(100% + 3px + 1px);
      width: 100%;
    }

    &::after {
      background: linear-gradient(
        to right,
        transparent 34px,
        black 0,
        black 54px,
        transparent 0,
        transparent calc(100% - 54px),
        black 0,
        black calc(100% - 48px),
        black calc(100% - 34px),
        transparent 0
      );
      content: "";
      height: calc(0.425rem - 1px);
      left: 0;
      position: absolute;
      top: calc(100% + 3px + 1px);
      width: 100%;
    }
  }
`;

const FixtureTiming = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  & p {
    ${smallText};
    margin: 0;

    &:first-of-type {
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:last-of-type {
      flex-shrink: 0;
      text-align: right;
    }
  }
`;

const CompetitionName = styled.p`
  ${smallText};
  margin: 0;
  text-align: center;
`;

const OpponentsList = styled.ul`
  background-color: ${webTheme.colors.background.foremost};
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 2px;
  box-shadow: 0.5px 1.5px 0 0 black;
  color: ${webTheme.colors.text.primary};
`;

interface FixtureProps {
  fixture: CommonFixture;
  showAllScores: boolean;
  useSoundEffects: boolean;
  showCompetition: boolean;
}

function Fixture({
  fixture,
  showAllScores,
  useSoundEffects,
  showCompetition,
}: FixtureProps) {
  const formattedDate = new Date(fixture.utcDate).toLocaleDateString(
    "default",
    {
      day: "numeric",
      month: "short",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    }
  );

  return (
    <FixtureRow>
      <FixtureTiming>
        <p>{formattedDate}</p>
        <FixtureStatus fixture={fixture} />
      </FixtureTiming>

      <OpponentsList>
        <OpponentRow
          team={fixture.homeTeam}
          score={fixture.score.fullTime.home}
          showAllScores={showAllScores}
          useSoundEffects={useSoundEffects}
          status={fixture.status}
          isHomeTeam={true}
        />
        <OpponentRow
          team={fixture.awayTeam}
          score={fixture.score.fullTime.away}
          showAllScores={showAllScores}
          useSoundEffects={useSoundEffects}
          status={fixture.status}
          isHomeTeam={false}
        />
      </OpponentsList>

      {showCompetition && (
        <CompetitionName>{fixture.competition.name}</CompetitionName>
      )}
    </FixtureRow>
  );
}

export default Fixture;
