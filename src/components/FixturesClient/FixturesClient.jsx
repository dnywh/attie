"use client";
import { useState, useEffect } from "react";

import { Switch } from "@headlessui/react";

import { styled } from "@pigment-css/react";

import { COMPETITIONS } from "@/constants/competitions";

import Fixture from "@/components/Fixture";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const fixturesCache = new Map(); // { code: { timestamp: number, data: array } }

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
  const [showAllScores, setShowAllScores] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    "premier-league",
    // "champions-league",
  ]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  const fetchFixturesForCompetition = async (code) => {
    const now = Date.now();
    const cached = fixturesCache.get(code);

    // Return cached data if fresh enough
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const res = await fetch(`/api/fixtures/${code}`);
    const data = await res.json();
    const matches = (data.matches || []).map((match) => ({
      ...match,
      competitionCode: code,
    }));

    // Cache the new data
    fixturesCache.set(code, {
      timestamp: now,
      data: matches,
    });

    return matches;
  };

  // Initial load
  useEffect(() => {
    const loadInitialFixtures = async () => {
      setLoading(true);
      try {
        const initialCodes = selectedCompetitions.map(
          (l) => COMPETITIONS[l].code
        );
        const matches = await Promise.all(
          initialCodes.map(fetchFixturesForCompetition)
        );
        setFixtures(
          matches
            .flat()
            .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
        );
      } catch (error) {
        console.error("Failed to fetch fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFixtures();
  }, []);

  const handleCompetitionChange = async (event) => {
    const competition = event.target.name;
    const competitionCode = COMPETITIONS[competition].code;

    setLoading(true);
    try {
      if (selectedCompetitions.includes(competition)) {
        // Remove competition
        setSelectedCompetitions((prev) =>
          prev.filter((l) => l !== competition)
        );
        setFixtures((prev) =>
          prev.filter((fixture) => fixture.competitionCode !== competitionCode)
        );
      } else {
        // Add competition
        setSelectedCompetitions((prev) => [...prev, competition]);
        const newMatches = await fetchFixturesForCompetition(competitionCode);
        setFixtures((prev) =>
          [...prev, ...newMatches].sort(
            (a, b) => new Date(b.utcDate) - new Date(a.utcDate)
          )
        );
      }
    } catch (error) {
      console.error("Failed to update fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <FilterSection>
        <Select>
          <option value="football">Football</option>
          {/* <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option> */}
          <option value="tba" disabled>
            After another sport? Email us: "hello" at this domain
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

        <StyledSwitch checked={showAllScores} onChange={setShowAllScores}>
          <span>{showAllScores ? "Hide" : "Show"} all scores</span>
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
                        showAllScores={showAllScores}
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
