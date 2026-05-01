import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("normalised fixtures route", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns normalised fixtures through the Attie API facade", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        events: [
          {
            id: "401",
            date: "2026-05-01T10:00:00Z",
            competitions: [
              {
                status: {
                  type: {
                    name: "STATUS_FINAL",
                    shortDetail: "FT",
                  },
                },
                competitors: [
                  {
                    homeAway: "home",
                    score: "2",
                    team: {
                      name: "Home FC",
                      shortDisplayName: "Home",
                      logo: "https://example.com/home.png",
                    },
                  },
                  {
                    homeAway: "away",
                    score: "1",
                    team: {
                      name: "Away FC",
                      shortDisplayName: "Away",
                      logo: "https://example.com/away.png",
                    },
                  },
                ],
              },
            ],
          },
        ],
        meta: {
          next_cursor: null,
          per_page: null,
          has_more: false,
        },
      })
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/fixtures?competition=premier-league&dateFrom=2026-05-01&dateTo=2026-05-02&direction=past"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock.mock.calls[0][0]?.toString()).toContain(
      "/api/espn?dateFrom=2026-05-01&dateTo=2026-05-03&direction=past&sport=soccer&league=eng.1"
    );
    expect(body.fixtures[0].homeTeam.shortName).toBe("Home");
    expect(body.meta.count).toBe(1);
  });

  it("surfaces provider rate limits", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ error: "Rate limit exceeded" }, { status: 429 })
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/fixtures?competition=nba&dateFrom=2026-05-01&dateTo=2026-05-02"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.isRateLimit).toBe(true);
  });
});
