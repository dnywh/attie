import { sortFixtures } from "@/utils/dates";
import type { CommonFixture, Direction } from "@/types/domain";

export interface MergeFixturesResult {
  fixtures: CommonFixture[];
  addedCount: number;
  changedCount: number;
}

export const mergeFixtures = (
  existingFixtures: CommonFixture[],
  incomingFixtures: CommonFixture[],
  direction: Direction
): MergeFixturesResult => {
  const fixturesById = new Map(
    existingFixtures.map((fixture) => [fixture.id, fixture])
  );
  let addedCount = 0;
  let changedCount = 0;

  incomingFixtures.forEach((incomingFixture) => {
    const existingFixture = fixturesById.get(incomingFixture.id);

    if (!existingFixture) {
      addedCount += 1;
      changedCount += 1;
      fixturesById.set(incomingFixture.id, incomingFixture);
      return;
    }

    if (JSON.stringify(existingFixture) !== JSON.stringify(incomingFixture)) {
      changedCount += 1;
      fixturesById.set(incomingFixture.id, incomingFixture);
    }
  });

  if (changedCount === 0) {
    return {
      fixtures: existingFixtures,
      addedCount: 0,
      changedCount: 0,
    };
  }

  return {
    fixtures: sortFixtures([...fixturesById.values()], direction),
    addedCount,
    changedCount,
  };
};
