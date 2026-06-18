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
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(fetchMock.mock.calls[0][0]?.toString()).toContain(
      "/api/espn?dateFrom=2026-05-01&dateTo=2026-05-03&direction=past&sport=soccer&league=eng.1"
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
    expect(body.fixtures[0].homeTeam.shortName).toBe("Home");
    expect(body.meta.count).toBe(1);
  });

  it("returns normalised FIFA World Cup fixtures", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        events: [
          {
            id: "760415",
            date: "2026-06-11T19:00Z",
            season: {
              slug: "group-stage",
            },
            competitions: [
              {
                status: {
                  type: {
                    name: "STATUS_SCHEDULED",
                    shortDetail: "11 Jun",
                  },
                },
                competitors: [
                  {
                    homeAway: "home",
                    score: "0",
                    team: {
                      name: "Mexico",
                      shortDisplayName: "Mexico",
                      logo: "https://a.espncdn.com/i/teamlogos/countries/500/mex.png",
                    },
                  },
                  {
                    homeAway: "away",
                    score: "0",
                    team: {
                      name: "South Africa",
                      shortDisplayName: "South Africa",
                      logo: "https://a.espncdn.com/i/teamlogos/countries/500/rsa.png",
                    },
                  },
                ],
              },
            ],
          },
        ],
      })
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/fixtures?competition=fifa-world-cup&dateFrom=2026-06-11&dateTo=2026-07-19&direction=future"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(fetchMock.mock.calls[0][0]?.toString()).toContain(
      "/api/espn?dateFrom=2026-06-11&dateTo=2026-07-20&direction=future&sport=soccer&league=fifa.world"
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
    expect(body.fixtures[0]).toMatchObject({
      competition: { name: "FIFA World Cup", stage: "Group stage" },
      homeTeam: { shortName: "Mexico" },
      awayTeam: { shortName: "South Africa" },
    });
    expect(body.meta.competitions).toEqual(["fifa-world-cup"]);
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
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.isRateLimit).toBe(true);
  });
});
