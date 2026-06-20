import { sortFixtures } from "@/utils/dates";
import { formatLocalDate } from "@/utils/fixtureTime";
import type { CommonFixture, Direction } from "@/types/domain";
import type { FixtureDateRange } from "./types";

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

const fixtureLocalDateString = (fixture: Pick<CommonFixture, "utcDate">) =>
  formatLocalDate(new Date(fixture.utcDate));

const isFixtureInDateRange = (
  fixture: Pick<CommonFixture, "utcDate">,
  range: FixtureDateRange
): boolean => {
  const fixtureDate = fixtureLocalDateString(fixture);

  return fixtureDate >= range.dateFrom && fixtureDate <= range.dateTo;
};

export const reconcileRefreshedFixtures = (
  existingFixtures: CommonFixture[],
  incomingFixtures: CommonFixture[],
  direction: Direction,
  options: {
    refreshedRange: FixtureDateRange;
    refreshedCompetitionNames: Set<string>;
  }
): MergeFixturesResult => {
  const incomingIds = new Set(incomingFixtures.map((fixture) => fixture.id));
  const removedFixtures = existingFixtures.filter((fixture) => {
    return (
      options.refreshedCompetitionNames.has(fixture.competition.name) &&
      isFixtureInDateRange(fixture, options.refreshedRange) &&
      !incomingIds.has(fixture.id)
    );
  });
  const removedIds = new Set(removedFixtures.map((fixture) => fixture.id));
  const retainedFixtures = existingFixtures.filter(
    (fixture) => !removedIds.has(fixture.id)
  );
  const merged = mergeFixtures(retainedFixtures, incomingFixtures, direction);
  const removedCount = removedFixtures.length;

  if (removedCount <= 0) {
    return merged;
  }

  return {
    fixtures: sortFixtures(merged.fixtures, direction),
    addedCount: merged.addedCount,
    changedCount: merged.changedCount + removedCount,
  };
};
