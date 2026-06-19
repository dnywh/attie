import { describe, expect, it, vi } from "vitest";
import { COMPETITIONS } from "@/constants/competitions";
import { buildFixtureApiUrl, fetchFixtureWindow } from "./api";

describe("fixture API helpers", () => {
  it("builds adapter URLs without the removed page parameter", () => {
    const url = buildFixtureApiUrl(COMPETITIONS.nba, {
      dateFrom: "2026-05-01",
      dateTo: "2026-05-02",
      direction: "past",
      cursor: 123,
    });

    expect(url).toBe(
      "/api/nba?dateFrom=2026-05-01&dateTo=2026-05-02&direction=past&cursor=123"
    );
  });

  it("builds the ESPN URL for the FIFA World Cup", () => {
    const url = buildFixtureApiUrl(COMPETITIONS["fifa-world-cup"], {
      dateFrom: "2026-06-11",
      dateTo: "2026-07-19",
      direction: "future",
    });

    expect(url).toBe(
      "/api/espn?dateFrom=2026-06-11&dateTo=2026-07-19&direction=future&sport=soccer&league=fifa.world"
    );
  });

  it("follows Ball Don't Lie cursors within a fixture window", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json({
          matches: [],
          meta: {
            next_cursor: 456,
            per_page: 25,
            has_more: true,
          },
        })
      )
      .mockResolvedValueOnce(
        Response.json({
          matches: [],
          meta: {
            next_cursor: null,
            per_page: 25,
            has_more: false,
          },
        })
      );

    await fetchFixtureWindow(
      ["mlb"],
      { fromOffset: -1, toOffset: 0 },
      "backwards",
      {
        fetcher,
        today: new Date(2026, 4, 1, 12),
      }
    );

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0][0]).toBe(
      "/api/mlb?dateFrom=2026-04-29&dateTo=2026-05-02&direction=past"
    );
    expect(fetcher.mock.calls[1][0]).toBe(
      "/api/mlb?dateFrom=2026-04-29&dateTo=2026-05-02&direction=past&cursor=456"
    );
  });

  it("pads provider date windows before adapter-specific date handling", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        events: [],
        meta: {
          next_cursor: null,
          per_page: null,
          has_more: false,
        },
      })
    );

    await fetchFixtureWindow(
      ["premier-league"],
      { fromOffset: 0, toOffset: 28 },
      "forwards",
      {
        fetcher,
        today: new Date(2026, 4, 1, 12),
      }
    );

    expect(fetcher.mock.calls[0][0]).toContain(
      "/api/espn?dateFrom=2026-04-30&dateTo=2026-05-31&direction=future&sport=soccer&league=eng.1"
    );
  });
});
