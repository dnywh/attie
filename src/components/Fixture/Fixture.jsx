"use client";
import { useState, useEffect } from "react";
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

  "&:hover": {
    transform: "scale(1.1)",
    cursor: "pointer",
  },
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

  const [showFixtureScores, setShowFixtureScores] = useState(false); // Fixture-level score visibility

  // Reset fixture scores when global scores are toggled
  useEffect(() => {
    if (!showAllScores) {
      setShowFixtureScores(false);
    }
  }, [showAllScores]);

  const areScoresVisible = showAllScores || showFixtureScores;

  const handleShowOrHideFixtureScores = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!showAllScores) {
      setShowFixtureScores(!showFixtureScores);
    }
  };

  return (
    <FixtureRow
      onClick={handleShowOrHideFixtureScores}
      style={{ cursor: showAllScores ? "default" : "pointer" }}
    >
      <FixtureTiming>
        <p>{formattedDate}</p>
        <FixtureStatus fixture={fixture} />
      </FixtureTiming>

      <ul>
        <OpponentRow
          team={fixture.homeTeam}
          score={fixture.score.fullTime.home}
          showAllScores={showAllScores}
          showFixtureScores={showFixtureScores}
        />
        <OpponentRow
          team={fixture.awayTeam}
          score={fixture.score.fullTime.away}
          showAllScores={showAllScores}
          showFixtureScores={showFixtureScores}
        />
      </ul>

      <CompetitionName>{fixture.competition.name}</CompetitionName>
    </FixtureRow>
  );
}

export default Fixture;
