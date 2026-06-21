import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("ESPN provider route", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("fetches short scoreboard windows one day at a time", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ events: [espnEvent("day-1")] }))
      .mockResolvedValueOnce(Response.json({ events: [espnEvent("day-2")] }));

    const response = await GET(
      new Request(
        "https://attie.test/api/espn?dateFrom=2026-06-20&dateTo=2026-06-21&direction=past&sport=soccer&league=fifa.world&_refresh=fresh-123"
      )
    );
    const body = await response.json();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]?.toString()).toContain(
      "dates=20260620"
    );
    expect(fetchMock.mock.calls[0][0]?.toString()).toContain("_=fresh-123");
    expect(fetchMock.mock.calls[1][0]?.toString()).toContain(
      "dates=20260621"
    );
    expect(body.events.map(({ id }: { id: string }) => id)).toEqual([
      "day-1",
      "day-2",
    ]);
    expect(body.meta.matchCount).toBe(2);
  });

  it("replaces broad range events with fresh recent single-day events", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T23:00:00Z"));

    vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({
          events: [
            espnEvent("live", {
              detail: "67'",
              statusName: "STATUS_SECOND_HALF",
            }),
          ],
        })
      )
      .mockResolvedValueOnce(Response.json({ events: [] }))
      .mockResolvedValueOnce(
        Response.json({
          events: [
            espnEvent("live", {
              detail: "FT",
              statusName: "STATUS_FINAL",
            }),
          ],
        })
      );

    const response = await GET(
      new Request(
        "https://attie.test/api/espn?dateFrom=2026-06-01&dateTo=2026-07-01&direction=past&sport=soccer&league=fifa.world&_refresh=fresh-456"
      )
    );
    const body = await response.json();

    expect(body.events).toHaveLength(1);
    expect(body.events[0].competitions[0].status.type).toMatchObject({
      name: "STATUS_FINAL",
      shortDetail: "FT",
    });
  });
});

function espnEvent(
  id: string,
  options: { detail?: string; statusName?: string } = {}
) {
  return {
    id,
    date: "2026-06-21T22:00Z",
    competitions: [
      {
        status: {
          type: {
            name: options.statusName ?? "STATUS_FINAL",
            shortDetail: options.detail ?? "FT",
          },
        },
        competitors: [],
      },
    ],
  };
}
