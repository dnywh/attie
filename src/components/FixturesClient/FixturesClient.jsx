"use client";
import { useState, useEffect } from "react";

import { Switch } from "@headlessui/react";

import { LEAGUES } from "@/constants/leagues";

import Fixture from "@/components/Fixture";

export default function FixturesClient() {
  const [showScore, setShowScore] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState(["premier-league"]);
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
      const results = await Promise.all(
        leagueCodes.map((code) =>
          fetch(`/api/fixtures/${code}`).then((res) => res.json())
        )
      );

      const allMatches = results.flatMap((result) => result.matches || []);
      const allMatchesReversed = allMatches.reverse();
      setFixtures(allMatchesReversed);
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
      <fieldset>
        <legend>Leagues:</legend>
        <div>
          <input
            type="checkbox"
            id="premier-league"
            name="premier-league"
            checked={selectedLeagues.includes("premier-league")}
            onChange={handleLeagueChange}
          />
          <label htmlFor="premier-league">Premier League</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="champions-league"
            name="champions-league"
            checked={selectedLeagues.includes("champions-league")}
            onChange={handleLeagueChange}
          />
          <label htmlFor="champions-league">UEFA Champions League</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="europa-league"
            name="europa-league"
            checked={selectedLeagues.includes("europa-league")}
            onChange={handleLeagueChange}
          />
          <label htmlFor="europa-league">UEFA Europa League</label>
        </div>
      </fieldset>

      <Switch checked={showScore} onChange={setShowScore}>
        {/* className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600" */}
        <span>
          {/*  className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" */}
          Scores {showScore ? "ON" : "OFF"}
        </span>
      </Switch>

      {loading ? (
        <p>Loading fixtures...</p>
      ) : fixtures?.length > 0 ? (
        <ul>
          {fixtures.map((fixture) => (
            <Fixture key={fixture.id} showScore={showScore} {...fixture} />
          ))}
        </ul>
      ) : (
        <p>No fixtures found</p>
      )}
    </>
  );
}
