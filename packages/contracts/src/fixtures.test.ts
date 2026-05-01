import { describe, expect, it } from "vitest";
import fixtures from "../fixtures/common-fixtures.json";
import { DEFAULTS, isCompetitionKey, isSportKey } from ".";
import type { CommonFixture, FixtureListResponse } from ".";

describe("shared contracts", () => {
  it("keeps defaults inside the shared catalogues", () => {
    expect(isSportKey(DEFAULTS.SPORT)).toBe(true);
    expect(DEFAULTS.COMPETITIONS.every(isCompetitionKey)).toBe(true);
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
