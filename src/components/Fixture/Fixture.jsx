import FixtureStatus from "@/components/FixtureStatus";
import OpponentRow from "@/components/OpponentRow";

import { styled } from "@pigment-css/react";

const StyledRow = styled("li")({
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

const CompetitionName = styled("p")({
  textTransform: "uppercase",
  letterSpacing: "0.085em",
  fontSize: "0.8em",
  textAlign: "center",
  margin: "0",
});

function Fixture({ fixture, showScore }) {
  const formattedDate = new Date(fixture.utcDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <StyledRow>
      <FixtureTiming>
        <p>{formattedDate}</p>
        <FixtureStatus fixture={fixture} />
      </FixtureTiming>

      <ul>
        <OpponentRow
          team={fixture.homeTeam}
          score={fixture.score.fullTime.home}
          showScore={showScore}
        />
        <OpponentRow
          team={fixture.awayTeam}
          score={fixture.score.fullTime.away}
          showScore={showScore}
        />
      </ul>

      <CompetitionName>{fixture.competition.name}</CompetitionName>
    </StyledRow>
  );
}

export default Fixture;
