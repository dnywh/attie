import { describe, expect, it } from "vitest";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "@/types/domain";
import { isFixtureVisibleForDirection } from "@/utils/fixtureVisibility";

const fixture = (
  id: string,
  utcDate: string,
  status: CommonFixture["status"]["type"]
): CommonFixture => ({
  id,
  utcDate,
  status: {
    type: status,
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

describe("fixture visibility", () => {
  const now = new Date("2026-05-01T12:00:00Z");

  it("shows live fixtures in the forwards direction after kickoff", () => {
    expect(
      isFixtureVisibleForDirection(
        fixture("live", "2026-05-01T10:00:00Z", FIXTURE_STATUS.LIVE),
        "forwards",
        now
      )
    ).toBe(true);
  });

  it("does not show finished past fixtures in the forwards direction", () => {
    expect(
      isFixtureVisibleForDirection(
        fixture("finished", "2026-05-01T10:00:00Z", FIXTURE_STATUS.FINISHED),
        "forwards",
        now
      )
    ).toBe(false);
  });

  it("shows scheduled future fixtures in the forwards direction", () => {
    expect(
      isFixtureVisibleForDirection(
        fixture("scheduled", "2026-05-01T14:00:00Z", FIXTURE_STATUS.SCHEDULED),
        "forwards",
        now
      )
    ).toBe(true);
  });

  it("does not show scheduled past fixtures in either direction", () => {
    const scheduledPast = fixture(
      "scheduled-past",
      "2026-05-01T10:00:00Z",
      FIXTURE_STATUS.SCHEDULED
    );

    expect(
      isFixtureVisibleForDirection(scheduledPast, "forwards", now)
    ).toBe(false);
    expect(
      isFixtureVisibleForDirection(scheduledPast, "backwards", now)
    ).toBe(false);
  });

  it("shows live and finished past fixtures in the backwards direction", () => {
    expect(
      isFixtureVisibleForDirection(
        fixture("live", "2026-05-01T10:00:00Z", FIXTURE_STATUS.LIVE),
        "backwards",
        now
      )
    ).toBe(true);
    expect(
      isFixtureVisibleForDirection(
        fixture("finished", "2026-05-01T10:00:00Z", FIXTURE_STATUS.FINISHED),
        "backwards",
        now
      )
    ).toBe(true);
  });
});
