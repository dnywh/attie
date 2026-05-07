import { describe, expect, it } from "vitest";
import fixtures from "../fixtures/common-fixtures.json";
import {
  COMPETITIONS,
  DEFAULTS,
  SPORTS,
  getCompetitionsForSport,
  getDefaultCompetitionForSport,
  getDefaultCompetitionsForSport,
  isCompetitionKey,
  isSportKey,
} from ".";
import type { CommonFixture, FixtureListResponse } from ".";

describe("shared contracts", () => {
  it("keeps defaults inside the shared catalogues", () => {
    expect(isSportKey(DEFAULTS.SPORT)).toBe(true);
    expect(DEFAULTS.COMPETITIONS.every(isCompetitionKey)).toBe(true);
    expect(DEFAULTS.SPORT).toBe("football");
    expect(DEFAULTS.COMPETITIONS).toEqual([
      "fifa-world-cup",
      "premier-league",
    ]);
    expect(SPORTS.football.name).toBe("Soccer");
  });

  it("includes FIFA World Cup as the first default soccer competition", () => {
    expect(isCompetitionKey("fifa-world-cup")).toBe(true);
    expect(Object.keys(getCompetitionsForSport("football")).slice(0, 2)).toEqual([
      "fifa-world-cup",
      "premier-league",
    ]);
    expect(COMPETITIONS["fifa-world-cup"]).toMatchObject({
      sport: "football",
      name: "FIFA World Cup",
      defaultForSport: true,
      api: {
        adapter: "espn",
        sport: "soccer",
        league: "fifa.world",
      },
    });
    expect(getDefaultCompetitionForSport("football")).toBe("fifa-world-cup");
    expect(getDefaultCompetitionsForSport("football")).toEqual([
      "fifa-world-cup",
      "premier-league",
    ]);
  });

  it("loads golden fixtures using the normalised response shape", () => {
    const response = fixtures as FixtureListResponse;
    const firstFixture: CommonFixture | undefined = response.fixtures[0];

    expect(response.meta.competitions).toContain("premier-league");
    expect(response.meta.count).toBe(response.fixtures.length);
    expect(firstFixture?.homeTeam.shortName).toBe("ARS");
    expect(firstFixture?.score.fullTime.home).toBe(2);
  });
});
