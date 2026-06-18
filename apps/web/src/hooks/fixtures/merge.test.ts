import { describe, expect, it } from "vitest";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "@/types/domain";
import { mergeFixtures } from "./merge";

const fixture = (id: string, utcDate: string): CommonFixture => ({
  id,
  utcDate,
  status: {
    type: FIXTURE_STATUS.SCHEDULED,
    detail: null,
  },
  competition: {
    name: "Premier League",
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
});
