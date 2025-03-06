"use client";
import { useState, useEffect } from "react";

import { Switch } from "@headlessui/react";

import { styled } from "@pigment-css/react";

import { COMPETITIONS } from "@/constants/competitions";

import Fixture from "@/components/Fixture";

const Main = styled("main")({
  display: "flex",
  flexDirection: "column",
  gap: "4rem",
});

const FilterSection = styled("section")({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const Select = styled("select")({
  width: "100%",
});

const StyledSwitch = styled(Switch)({
  width: "100%",
});

const AllFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

const DateGroup = styled("li")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",

  "& h2": {
    // fontSize: "1.5rem",
    textAlign: "center",
  },
});

const DateFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const groupFixturesByDate = (fixtures) => {
  return fixtures.reduce((groups, fixture) => {
    const date = new Date(fixture.utcDate).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(fixture);
    return groups;
  }, {});
};

export default function FixturesClient() {
  const [showScore, setShowScore] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    "premier-league",
    // "champions-league",
  ]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Load initial data
  useEffect(() => {
    fetchFixtures(selectedCompetitions);
  }, []);

  const fetchFixtures = async (competitions) => {
    setLoading(true);
    try {
      const competitionCodes = competitions.map((l) => COMPETITIONS[l].code);

      // Fetch and combine all matches in one step
      const allMatches = (
        await Promise.all(
          competitionCodes.map(async (code) => {
            const res = await fetch(`/api/fixtures/${code}`);
            const data = await res.json();
            return (data.matches || []).map((match) => ({
              ...match,
              competitionCode: code,
            }));
          })
        )
      ).flat();

      // Sort by date
      const sortedMatches = allMatches.sort(
        (a, b) => new Date(b.utcDate) - new Date(a.utcDate)
      );

      setFixtures(sortedMatches);
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitionChange = async (event) => {
    const competition = event.target.name;
    const newSelectedCompetitions = selectedCompetitions.includes(competition)
      ? selectedCompetitions.filter((l) => l !== competition)
      : [...selectedCompetitions, competition];

    setSelectedCompetitions(newSelectedCompetitions);
    fetchFixtures(newSelectedCompetitions);
  };

  return (
    <Main>
      <FilterSection>
        <Select>
          <option value="football">Football</option>
          {/* <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option> */}
          <option value="tba" disabled>
            After another sport? Let us know. Email: "hello" at this domain
          </option>
        </Select>
        <fieldset>
          <legend>Competitions:</legend>
          {Object.entries(COMPETITIONS)
            .filter(([, competition]) => competition.tier !== "paid")
            .map(([competitionId, competition]) => (
              <div key={competitionId}>
                <input
                  type="checkbox"
                  id={competitionId}
                  name={competitionId}
                  checked={selectedCompetitions.includes(competitionId)}
                  onChange={handleCompetitionChange}
                />
                <label htmlFor={competitionId}>{competition.name}</label>
              </div>
            ))}
        </fieldset>

        <StyledSwitch checked={showScore} onChange={setShowScore}>
          <span>{showScore ? "Hide" : "Show"} scores</span>
        </StyledSwitch>
      </FilterSection>

      <section>
        {loading ? (
          <p>Loading fixtures...</p>
        ) : fixtures?.length > 0 ? (
          <AllFixturesList>
            {Object.entries(groupFixturesByDate(fixtures)).map(
              ([date, dateFixtures]) => (
                <DateGroup key={date}>
                  <h2>{date}</h2>
                  <DateFixturesList>
                    {dateFixtures.map((fixture) => (
                      <Fixture
                        key={fixture.id}
                        fixture={fixture}
                        showScore={showScore}
                      />
                    ))}
                  </DateFixturesList>
                </DateGroup>
              )
            )}
          </AllFixturesList>
        ) : (
          <p>No fixtures found</p>
        )}
      </section>
    </Main>
  );
}
