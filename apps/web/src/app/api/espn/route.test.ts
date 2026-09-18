import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("ESPN provider route", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches short scoreboard windows one day at a time", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ events: [espnEvent("day-1")] }))
      .mockResolvedValueOnce(Response.json({ events: [espnEvent("day-2")] }));

    const response = await GET(
      new Request(
        "https://attie.test/api/espn?dateFrom=2026-06-20&dateTo=2026-06-21&direction=past&sport=soccer&league=eng.1&_refresh=fresh-123"
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

  it("fetches long scoreboard windows as single days in parallel chunks", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input) => {
        const url = input.toString();
        const dates = new URL(url).searchParams.get("dates") ?? "";

        expect(dates).not.toContain("-");

        return Response.json({
          events: [espnEvent(`day-${dates}`)],
        });
      }
    );

    const response = await GET(
      new Request(
        "https://attie.test/api/espn?dateFrom=2026-06-01&dateTo=2026-07-01&direction=future&sport=soccer&league=eng.1&_refresh=fresh-456"
      )
    );
    const body = await response.json();

    // Inclusive range: 1 June through 1 July is 31 days.
    expect(fetchMock).toHaveBeenCalledTimes(31);
    expect(
      fetchMock.mock.calls.every(
        ([request]) => !request?.toString().includes("dates=20260601-")
      )
    ).toBe(true);
    expect(body.meta.matchCount).toBe(31);
    expect(body.events).toHaveLength(31);
  });

  it("rejects oversized scoreboard windows before calling ESPN", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await GET(
      new Request(
        "https://attie.test/api/espn?dateFrom=2026-01-01&dateTo=2026-03-15&direction=future&sport=soccer&league=eng.1"
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("Date range too large");
    expect(body.error).toContain("60 days");
    expect(fetchMock).not.toHaveBeenCalled();
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
