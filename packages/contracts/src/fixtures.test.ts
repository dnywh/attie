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
    expect(DEFAULTS.COMPETITIONS).toEqual(["premier-league"]);
    expect(SPORTS.football.name).toBe("Soccer");
  });

  it("uses Premier League as the default soccer competition", () => {
    expect(isCompetitionKey("fifa-world-cup")).toBe(false);
    expect(Object.keys(getCompetitionsForSport("football"))[0]).toBe(
      "premier-league"
    );
    expect(COMPETITIONS["premier-league"]).toMatchObject({
      sport: "football",
      name: "Premier League",
      defaultForSport: true,
      api: {
        adapter: "espn",
        sport: "soccer",
        league: "eng.1",
      },
    });
    expect(getDefaultCompetitionForSport("football")).toBe("premier-league");
    expect(getDefaultCompetitionsForSport("football")).toEqual(["premier-league"]);
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
