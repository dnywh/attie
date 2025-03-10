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
  backgroundColor: "#FEE272",
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
    margin: "0",
    "&:first-of-type": {
      textAlign: "left",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "&:last-of-type": {
      textAlign: "right",
    },
  },
});

const OpponentsList = styled("ul")({
  borderColor: "black",
  borderWidth: "1px",
  borderStyle: "solid",
  backgroundColor: "white",
});

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
          isHomeTeam={true}
        />
        <OpponentRow
          team={fixture.awayTeam}
          score={fixture.score.fullTime.away}
          showAllScores={showAllScores}
          status={fixture.status}
          isHomeTeam={false}
        />
      </OpponentsList>

      <CompetitionName>{fixture.competition.name}</CompetitionName>
    </FixtureRow>
  );
}

export default Fixture;
