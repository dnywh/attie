import FixtureStatus from "@/components/FixtureStatus";
import OpponentRow from "@/components/OpponentRow";

import { styled } from "@pigment-css/react";

const FixtureRow = styled("li")({
  display: "flex",
  flexDirection: "column",
  gap: "0.65rem",
  padding: "0.65rem",
  borderColor: "black",
  borderStyle: "solid",
  borderWidth: "1px",
});

const FixtureTiming = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",

  "& p": {
    textTransform: "uppercase",
    letterSpacing: "0.085em",
    fontSize: "0.8em",
    textAlign: "center",
    margin: "0",
  },
});

const OpponentsList = styled("ul")({});

const CompetitionName = styled("p")({
  textTransform: "uppercase",
  letterSpacing: "0.085em",
  fontSize: "0.8em",
  textAlign: "center",
  margin: "0",
});

function Fixture({ fixture, showAllScores }) {
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
          status={fixture.status}
        />
        <OpponentRow
          team={fixture.awayTeam}
          score={fixture.score.fullTime.away}
          showAllScores={showAllScores}
          status={fixture.status}
        />
      </OpponentsList>

      <CompetitionName>{fixture.competition.name}</CompetitionName>
    </FixtureRow>
  );
}

export default Fixture;
