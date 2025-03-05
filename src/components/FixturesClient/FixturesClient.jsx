"use client";
import { useState } from "react";
import { Switch } from "@headlessui/react";

import Fixture from "@/components/Fixture";

export default function FixturesClient({ fixtures }) {
  const [showScore, setShowScore] = useState(false);

  return (
    <>
      <Switch
        checked={showScore}
        onChange={setShowScore}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6">
          Scores {showScore ? "ON" : "OFF"}
        </span>
      </Switch>

      <ul>
        {fixtures.map((fixture) => (
          <Fixture key={fixture.id} showScore={showScore} {...fixture} />
        ))}
      </ul>
    </>
  );
}
