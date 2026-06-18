import { describe, expect, it } from "vitest";
import {
  ballDontLieParams,
  dateRangeParams,
  espnParams,
  fixturesParams,
} from "@/utils/api/params";
import { GET as espnGet } from "@/app/api/espn/route";
import { GET as nbaGet } from "@/app/api/nba/route";

describe("route parameter validation", () => {
  it("accepts a valid date range", () => {
    const result = dateRangeParams(
      new URLSearchParams("dateFrom=2026-05-01&dateTo=2026-05-02")
    );

    expect(result).toEqual({
      ok: true,
      value: {
        dateFrom: "2026-05-01",
        dateTo: "2026-05-02",
      },
    });
  });

  it("rejects malformed dates", () => {
    const result = dateRangeParams(
      new URLSearchParams("dateFrom=01-05-2026&dateTo=2026-05-02")
    );

    expect(result.ok).toBe(false);
  });

  it("requires ESPN sport and league params", () => {
    const result = espnParams(
      new URLSearchParams("dateFrom=2026-05-01&dateTo=2026-05-02")
    );

    expect(result.ok).toBe(false);
  });

  it("rejects non-numeric Ball Don't Lie cursors", () => {
    const result = ballDontLieParams(
      new URLSearchParams("dateFrom=2026-05-01&dateTo=2026-05-02&cursor=nope")
    );

    expect(result.ok).toBe(false);
  });

  it("accepts normalised fixture facade params", () => {
    const result = fixturesParams(
      new URLSearchParams(
        "competition=premier-league,nba&dateFrom=2026-05-01&dateTo=2026-05-02&direction=future"
      )
    );

    expect(result).toEqual({
      ok: true,
      value: {
        competitionKeys: ["premier-league", "nba"],
        cursor: undefined,
        dateFrom: "2026-05-01",
        dateTo: "2026-05-02",
        direction: "future",
      },
    });
  });

  it("rejects cursor pagination across multiple competitions", () => {
    const result = fixturesParams(
      new URLSearchParams(
        "competition=premier-league,nba&dateFrom=2026-05-01&dateTo=2026-05-02&cursor=10"
      )
    );

    expect(result.ok).toBe(false);
  });

  it("returns 400 from route handlers before malformed requests can throw", async () => {
    const espnResponse = await espnGet(
      new Request("https://attie.test/api/espn?dateTo=2026-05-02")
    );
    const nbaResponse = await nbaGet(
      new Request("https://attie.test/api/nba?dateFrom=2026-05-01")
    );

    expect(espnResponse.status).toBe(400);
    expect(espnResponse.headers.get("Cache-Control")).toBe("no-store");
    expect(nbaResponse.status).toBe(400);
    expect(nbaResponse.headers.get("Cache-Control")).toBe("no-store");
  });
});
