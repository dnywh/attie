"use client";
import { useState } from "react";
import { Switch } from "@headlessui/react";

import Fixture from "@/components/Fixture";

export default function FixturesClient({ fixtures }) {
  const [showScore, setShowScore] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState(["premier-league"]);

  const handleLeagueChange = (event) => {
    const league = event.target.name;
    setSelectedLeagues((prev) => {
      if (prev.includes(league)) {
        return prev.filter((l) => l !== league);
      } else {
        return [...prev, league];
      }
    });
  };

  return (
    <>
      <Switch checked={showScore} onChange={setShowScore}>
        {/* className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600" */}
        <span>
          {/*  className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" */}
          Scores {showScore ? "ON" : "OFF"}
        </span>
      </Switch>

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
          <label htmlFor="champions-league">Champions League</label>
        </div>
      </fieldset>
      <ul>
        {fixtures.map((fixture) => (
          <Fixture key={fixture.id} showScore={showScore} {...fixture} />
        ))}
      </ul>
    </>
  );
}
