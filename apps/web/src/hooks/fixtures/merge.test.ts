import { describe, expect, it } from "vitest";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "@/types/domain";
import { mergeFixtures, reconcileRefreshedFixtures } from "./merge";

const fixture = (
  id: string,
  utcDate: string,
  competitionName = "Premier League"
): CommonFixture => ({
  id,
  utcDate,
  status: {
    type: FIXTURE_STATUS.SCHEDULED,
    detail: null,
  },
  competition: {
    name: competitionName,
  },
  homeTeam: {
    name: "Home",
    shortName: "Home",
    crest: "https://example.com/home.png",
  },
  awayTeam: {
    name: "Away",
    shortName: "Away",
    crest: "https://example.com/away.png",
  },
  score: {
    fullTime: {
      home: null,
      away: null,
    },
  },
});

describe("fixture merging", () => {
  it("reports duplicate-only batches as adding no fixtures", () => {
    const existingFixture = fixture("a", "2026-05-01T10:00:00Z");

    expect(
      mergeFixtures([existingFixture], [existingFixture], "backwards")
    ).toEqual({
      fixtures: [existingFixture],
      addedCount: 0,
      changedCount: 0,
    });
  });

  it("dedupes and sorts new fixtures", () => {
    const existingFixture = fixture("a", "2026-05-01T10:00:00Z");
    const incomingFixture = fixture("b", "2026-04-30T10:00:00Z");
    const merged = mergeFixtures(
      [existingFixture],
      [existingFixture, incomingFixture],
      "backwards"
    );

    expect(merged.addedCount).toBe(1);
    expect(merged.changedCount).toBe(1);
    expect(merged.fixtures.map(({ id }) => id)).toEqual(["a", "b"]);
  });

  it("replaces stale duplicate fixtures and preserves sort order", () => {
    const existingFixture = fixture("a", "2026-05-01T10:00:00Z");
    const laterFixture = fixture("b", "2026-05-02T10:00:00Z");
    const refreshedFixture: CommonFixture = {
      ...existingFixture,
      status: {
        type: FIXTURE_STATUS.LIVE,
        detail: "1st half",
      },
      score: {
        fullTime: {
          home: 1,
          away: 0,
        },
      },
    };
    const merged = mergeFixtures(
      [existingFixture, laterFixture],
      [refreshedFixture],
      "backwards"
    );

    expect(merged.addedCount).toBe(0);
    expect(merged.changedCount).toBe(1);
    expect(merged.fixtures.map(({ id }) => id)).toEqual(["b", "a"]);
    expect(merged.fixtures[1].status).toEqual({
      type: FIXTURE_STATUS.LIVE,
      detail: "1st half",
    });
    expect(merged.fixtures[1].score.fullTime.home).toBe(1);
  });

  it("reconciles refreshed fixtures by replacing stale records", () => {
    const existingFixture = {
      ...fixture("live", "2026-05-01T10:00:00Z"),
      status: {
        type: FIXTURE_STATUS.LIVE,
        detail: "Live: 67",
      },
      score: {
        fullTime: {
          home: 1,
          away: 1,
        },
      },
    };
    const refreshedFixture = {
      ...existingFixture,
      status: {
        type: FIXTURE_STATUS.FINISHED,
        detail: "FT",
      },
      score: {
        fullTime: {
          home: 2,
          away: 1,
        },
      },
    };
    const reconciled = reconcileRefreshedFixtures(
      [existingFixture],
      [refreshedFixture],
      "backwards",
      {
        refreshedRange: {
          dateFrom: "2026-05-01",
          dateTo: "2026-05-01",
        },
        refreshedCompetitionNames: new Set(["Premier League"]),
      }
    );

    expect(reconciled.changedCount).toBe(1);
    expect(reconciled.fixtures).toEqual([refreshedFixture]);
  });

  it("removes stale fixtures absent from the refreshed initial window", () => {
    const staleLiveFixture = {
      ...fixture("stale-live", "2026-05-01T10:00:00Z"),
      status: {
        type: FIXTURE_STATUS.LIVE,
        detail: "Live: 67",
      },
    };
    const loadedEarlierFixture = fixture("older", "2026-04-20T10:00:00Z");
    const otherCompetitionFixture = fixture("nba", "2026-05-01T10:00:00Z", "NBA");
    const reconciled = reconcileRefreshedFixtures(
      [staleLiveFixture, loadedEarlierFixture, otherCompetitionFixture],
      [],
      "backwards",
      {
        refreshedRange: {
          dateFrom: "2026-05-01",
          dateTo: "2026-05-01",
        },
        refreshedCompetitionNames: new Set(["Premier League"]),
      }
    );

    expect(reconciled.changedCount).toBe(1);
    expect(reconciled.fixtures.map(({ id }) => id)).toEqual(["nba", "older"]);
  });

  it("preserves loaded fixtures outside the refreshed window", () => {
    const outsideWindowFixture = fixture("outside", "2026-04-30T10:00:00Z");
    const refreshedFixture = fixture("fresh", "2026-05-01T10:00:00Z");
    const reconciled = reconcileRefreshedFixtures(
      [outsideWindowFixture],
      [refreshedFixture],
      "backwards",
      {
        refreshedRange: {
          dateFrom: "2026-05-01",
          dateTo: "2026-05-01",
        },
        refreshedCompetitionNames: new Set(["Premier League"]),
      }
    );

    expect(reconciled.fixtures.map(({ id }) => id)).toEqual(["fresh", "outside"]);
  });
});
