"use client";
import { useState, useEffect } from "react";

import { Switch } from "@headlessui/react";

import { COMPETITIONS } from "@/constants/competitions";

import Fixture from "@/components/Fixture";

export default function FixturesClient() {
  const [showScore, setShowScore] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    "premier-league",
    "champions-league",
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
    <>
      <section>
        <h2>Controls</h2>
        <fieldset>
          <legend>Competitions:</legend>
          {Object.entries(COMPETITIONS).map(([competitionId, competition]) => (
            <div key={competitionId}>
              <input
                type="checkbox"
                id={competitionId}
                name={competitionId}
                disabled={competition.tier === "paid"}
                checked={selectedCompetitions.includes(competitionId)}
                onChange={handleCompetitionChange}
              />
              <label htmlFor={competitionId}>
                {competition.name}{" "}
                {competition.tier === "paid" ? "(paid users only)" : ""}{" "}
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
