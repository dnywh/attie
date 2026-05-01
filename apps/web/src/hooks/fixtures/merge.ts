import { sortFixtures } from "@/utils/dates";
import type { CommonFixture, Direction } from "@/types/domain";

export interface MergeFixturesResult {
  fixtures: CommonFixture[];
  addedCount: number;
}

export const mergeFixtures = (
  existingFixtures: CommonFixture[],
  incomingFixtures: CommonFixture[],
  direction: Direction
): MergeFixturesResult => {
  const existingIds = new Set(existingFixtures.map((fixture) => fixture.id));
  const addedFixtures = incomingFixtures.filter(
    (fixture) => !existingIds.has(fixture.id)
  );

  if (addedFixtures.length === 0) {
    return {
      fixtures: existingFixtures,
      addedCount: 0,
    };
  }

  return {
    fixtures: sortFixtures([...existingFixtures, ...addedFixtures], direction),
    addedCount: addedFixtures.length,
  };
};
