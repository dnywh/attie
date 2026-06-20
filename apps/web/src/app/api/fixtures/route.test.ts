import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("normalised fixtures route", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns normalised fixtures through the Attie API facade", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-02T12:00:00Z"));

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
    expect(response.headers.get("Pragma")).toBe("no-cache");
    expect(response.headers.get("Expires")).toBe("0");
    expect(fetchMock.mock.calls[0][0]?.toString()).toContain(
      "/api/espn?dateFrom=2026-04-30&dateTo=2026-05-04&direction=past&sport=soccer&league=eng.1"
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
    expect(body.fixtures[0].homeTeam.shortName).toBe("Home");
    expect(body.meta.count).toBe(1);
    expect(body.meta.dateFrom).toBe("2026-05-01");
    expect(body.meta.dateTo).toBe("2026-05-02");
  });

  it("returns normalised FIFA World Cup fixtures", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T12:00:00Z"));

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
      "/api/espn?dateFrom=2026-06-10&dateTo=2026-07-21&direction=future&sport=soccer&league=fifa.world"
    );
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
    expect(body.fixtures[0]).toMatchObject({
      competition: { name: "FIFA World Cup", stage: "Group stage" },
      homeTeam: { shortName: "Mexico" },
      awayTeam: { shortName: "South Africa" },
    });
    expect(body.meta.competitions).toEqual(["fifa-world-cup"]);
  });

  it("filters padded provider data back to the requested past window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T21:00:00Z"));

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        events: [
          espnEvent({
            id: "finished",
            date: "2026-06-20T16:00:00Z",
            statusName: "STATUS_FINAL",
            shortDetail: "FT",
          }),
          espnEvent({
            id: "live",
            date: "2026-06-20T20:00:00Z",
            statusName: "STATUS_IN_PROGRESS",
            shortDetail: "87'",
          }),
          espnEvent({
            id: "scheduled-today",
            date: "2026-06-20T23:00:00Z",
            statusName: "STATUS_SCHEDULED",
            shortDetail: "23:00",
          }),
          espnEvent({
            id: "padded-future",
            date: "2026-06-21T20:00:00Z",
            statusName: "STATUS_SCHEDULED",
            shortDetail: "21 Jun",
          }),
        ],
      })
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/fixtures?competition=fifa-world-cup&dateFrom=2026-06-20&dateTo=2026-06-20&direction=past"
      )
    );
    const body = await response.json();

    expect(body.fixtures.map(({ id }: { id: string }) => id)).toEqual([
      "live",
      "finished",
    ]);
    expect(body.meta.count).toBe(2);
    expect(body.meta.dateFrom).toBe("2026-06-20");
    expect(body.meta.dateTo).toBe("2026-06-20");
  });

  it("filters padded provider data back to the requested future window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T21:00:00Z"));

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        events: [
          espnEvent({
            id: "finished",
            date: "2026-06-20T16:00:00Z",
            statusName: "STATUS_FINAL",
            shortDetail: "FT",
          }),
          espnEvent({
            id: "live",
            date: "2026-06-20T20:00:00Z",
            statusName: "STATUS_IN_PROGRESS",
            shortDetail: "87'",
          }),
          espnEvent({
            id: "scheduled-today",
            date: "2026-06-20T23:00:00Z",
            statusName: "STATUS_SCHEDULED",
            shortDetail: "23:00",
          }),
          espnEvent({
            id: "padded-tomorrow",
            date: "2026-06-21T20:00:00Z",
            statusName: "STATUS_SCHEDULED",
            shortDetail: "21 Jun",
          }),
        ],
      })
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/fixtures?competition=fifa-world-cup&dateFrom=2026-06-20&dateTo=2026-06-20&direction=future"
      )
    );
    const body = await response.json();

    expect(body.fixtures.map(({ id }: { id: string }) => id)).toEqual([
      "live",
      "scheduled-today",
    ]);
    expect(body.meta.count).toBe(2);
  });

  it("uses the caller timezone when trimming the public date window", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T00:00:00Z"));

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({
        events: [
          espnEvent({
            id: "local-evening",
            date: "2026-06-21T01:30:00Z",
            statusName: "STATUS_SCHEDULED",
            shortDetail: "20:30",
          }),
          espnEvent({
            id: "next-local-day",
            date: "2026-06-21T18:00:00Z",
            statusName: "STATUS_SCHEDULED",
            shortDetail: "13:00",
          }),
        ],
      })
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/fixtures?competition=fifa-world-cup&dateFrom=2026-06-20&dateTo=2026-06-20&direction=future&timeZone=America%2FMexico_City"
      )
    );
    const body = await response.json();

    expect(body.fixtures.map(({ id }: { id: string }) => id)).toEqual([
      "local-evening",
    ]);
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
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Pragma")).toBe("no-cache");
    expect(body.isRateLimit).toBe(true);
  });
});

function espnEvent({
  id,
  date,
  statusName,
  shortDetail,
}: {
  id: string;
  date: string;
  statusName: string;
  shortDetail: string;
}) {
  return {
    id,
    date,
    competitions: [
      {
        status: {
          type: {
            name: statusName,
            shortDetail,
          },
        },
        competitors: [
          {
            homeAway: "home",
            score: "1",
            team: {
              name: "Home FC",
              shortDisplayName: "Home",
              logo: "https://example.com/home.png",
            },
          },
          {
            homeAway: "away",
            score: "0",
            team: {
              name: "Away FC",
              shortDisplayName: "Away",
              logo: "https://example.com/away.png",
            },
          },
        ],
      },
    ],
  };
}
