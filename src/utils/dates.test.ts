import { describe, expect, it } from "vitest";
import { generateDateRange, groupFixturesByDate, sortFixtures } from "@/utils/dates";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "@/types/domain";

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

describe("date helpers", () => {
  it("generates an inclusive date range", () => {
    expect(generateDateRange("2026-05-01", "2026-05-03")).toEqual([
      "2026-05-01",
      "2026-05-02",
      "2026-05-03",
    ]);
  });

  it("sorts fixtures newest-first for backwards and soonest-first for forwards", () => {
    const fixtures = [
      fixture("late", "2026-05-03T10:00:00Z"),
      fixture("early", "2026-05-01T10:00:00Z"),
    ];

    expect(sortFixtures(fixtures, "backwards").map(({ id }) => id)).toEqual([
      "late",
      "early",
    ]);
    expect(sortFixtures(fixtures, "forwards").map(({ id }) => id)).toEqual([
      "early",
      "late",
    ]);
    expect(fixtures.map(({ id }) => id)).toEqual(["late", "early"]);
  });

  it("groups fixtures by local calendar day", () => {
    const grouped = groupFixturesByDate([
      fixture("a", "2026-05-01T10:00:00Z"),
      fixture("b", "2026-05-01T12:00:00Z"),
    ]);
    const groups = Object.values(grouped);

    expect(groups).toHaveLength(1);
    expect(groups[0].map(({ id }) => id)).toEqual(["a", "b"]);
    expect(groups[0][0].localDate).toBeInstanceOf(Date);
  });
});
