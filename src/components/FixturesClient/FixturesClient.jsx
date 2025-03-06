"use client";
import { useState, useEffect } from "react";

import { Switch } from "@headlessui/react";

import { LEAGUES } from "@/constants/leagues";

import Fixture from "@/components/Fixture";

export default function FixturesClient() {
  const [showScore, setShowScore] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState([
    "premier-league",
    "champions-league",
  ]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Load initial data
  useEffect(() => {
    fetchFixtures(selectedLeagues);
  }, []);

  const fetchFixtures = async (leagues) => {
    setLoading(true);
    try {
      const leagueCodes = leagues.map((l) => LEAGUES[l].code);

      // First, fetch all leagues in parallel
      const responses = await Promise.all(
        leagueCodes.map((code) =>
          fetch(`/api/fixtures/${code}`)
            .then((res) => res.json())
            .then((data) => data.matches || [])
        )
      );

      // Combine all matches into a single array and add league code
      const allMatches = responses.reduce((acc, matches, index) => {
        const leagueCode = leagueCodes[index];
        const matchesWithLeague = matches.map((match) => ({
          ...match,
          leagueCode,
        }));
        return [...acc, ...matchesWithLeague];
      }, []);

      // Sort all matches by date
      const sortedMatches = allMatches.sort((a, b) => {
        // Parse the dates once
        const dateA = new Date(a.utcDate).getTime();
        const dateB = new Date(b.utcDate).getTime();
        return dateB - dateA; // Most recent first
      });

      // Add debug logging
      console.log(
        "First 5 sorted matches:",
        sortedMatches.slice(0, 5).map((m) => ({
          date: new Date(m.utcDate).toISOString(),
          league: m.leagueCode,
          teams: `${m.homeTeam.name} vs ${m.awayTeam.name}`,
          timestamp: new Date(m.utcDate).getTime(),
        }))
      );

      setFixtures(sortedMatches);
    } catch (error) {
      console.error("Failed to fetch fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueChange = async (event) => {
    const league = event.target.name;
    const newSelectedLeagues = selectedLeagues.includes(league)
      ? selectedLeagues.filter((l) => l !== league)
      : [...selectedLeagues, league];

    setSelectedLeagues(newSelectedLeagues);
    fetchFixtures(newSelectedLeagues);
  };

  return (
    <>
      <section>
        <h2>Controls</h2>
        <fieldset>
          <legend>Competitions:</legend>
          {Object.entries(LEAGUES).map(([leagueId, league]) => (
            <div key={leagueId}>
              <input
                type="checkbox"
                id={leagueId}
                name={leagueId}
                disabled={league.tier === "paid"}
                checked={selectedLeagues.includes(leagueId)}
                onChange={handleLeagueChange}
              />
              <label htmlFor={leagueId}>
                {league.name}{" "}
                {league.tier === "paid" ? "(paid users only)" : ""}{" "}
              </label>
            </div>
          ))}
        </fieldset>

        <Switch checked={showScore} onChange={setShowScore}>
          {/* className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600" */}
          <span>
            {/*  className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" */}
            Scores {showScore ? "ON" : "OFF"}
          </span>
        </Switch>
      </section>

      <section>
        <h2>Results</h2>
        {loading ? (
          <p>Loading fixtures...</p>
        ) : fixtures?.length > 0 ? (
          <ul>
            {fixtures.map((fixture) => {
              // console.log(fixture);
              return (
                <Fixture
                  key={fixture.id}
                  fixture={fixture}
                  showScore={showScore}
                />
              );
            })}
          </ul>
        ) : (
          <p>No fixtures found</p>
        )}
      </section>
    </>
  );
}
