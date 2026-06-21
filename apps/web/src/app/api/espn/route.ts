import { NextResponse } from "next/server";
import { errorMessage, espnParams } from "@/utils/api/params";
import { addDaysToDateString } from "@/utils/fixtureTime";
import { generateDateRange } from "@/utils/dates";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const API_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports";
const MAX_SINGLE_DAY_SCOREBOARD_FETCHES = 14;
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

type EspnScoreboardEvent = {
  id?: string;
};

type EspnScoreboardPayload = {
  events?: EspnScoreboardEvent[];
};

const todayUtcDateString = (): string => new Date().toISOString().slice(0, 10);

const isDateInRange = (date: string, dateFrom: string, dateTo: string): boolean =>
  date >= dateFrom && date <= dateTo;

const mergeEventsById = (
  eventGroups: EspnScoreboardEvent[][]
): EspnScoreboardEvent[] => {
  const eventsById = new Map<string, EspnScoreboardEvent>();
  const unkeyedEvents: EspnScoreboardEvent[] = [];

  eventGroups.flat().forEach((event) => {
    if (!event.id) {
      unkeyedEvents.push(event);
      return;
    }

    eventsById.set(event.id, event);
  });

  return [...eventsById.values(), ...unkeyedEvents];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = espnParams(searchParams);

  if (!params.ok) {
    return NextResponse.json(
      { error: params.error },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const {
    dateFrom: rawDateFrom,
    dateTo: rawDateTo,
    direction,
    sport,
    league,
    groups,
    limit,
  } = params.value;
  const requestedDates = generateDateRange(rawDateFrom, rawDateTo);
  const today = todayUtcDateString();
  const liveSensitiveDates = [addDaysToDateString(today, -1), today].filter(
    (date) => isDateInRange(date, rawDateFrom, rawDateTo)
  );
  const shouldFetchSingleDays =
    requestedDates.length <= MAX_SINGLE_DAY_SCOREBOARD_FETCHES;
  const refreshToken =
    searchParams.get("_refresh") ?? `${Date.now()}-${Math.random()}`;

  const scoreboardUrl = (dates: string): string => {
    const queryParams = new URLSearchParams({
      dates,
      limit: limit ?? "100",
      _: refreshToken,
    });

    if (groups) {
      queryParams.set("groups", groups);
    }

    return `${API_BASE_URL}/${sport}/${league}/scoreboard?${queryParams.toString()}`;
  };

  const fetchScoreboard = async (dates: string): Promise<EspnScoreboardPayload> => {
    const response = await fetch(scoreboardUrl(dates), {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (response.status === 204) {
      return { events: [] };
    }

    if (!response.ok) {
      throw response;
    }

    return (await response.json()) as EspnScoreboardPayload;
  };

  try {
    const rangeDates = `${rawDateFrom.replace(/-/g, "")}-${rawDateTo.replace(/-/g, "")}`;
    const payloads = shouldFetchSingleDays
      ? await Promise.all(
          requestedDates.map((date) => fetchScoreboard(date.replace(/-/g, "")))
        )
      : [
          await fetchScoreboard(rangeDates),
          ...(await Promise.all(
            liveSensitiveDates.map((date) =>
              fetchScoreboard(date.replace(/-/g, ""))
            )
          )),
        ];
    const events = mergeEventsById(
      payloads.map((payload) => payload.events ?? [])
    );
    const matchCount = events.length;

    return NextResponse.json(
      {
        events,
        meta: {
          matchCount,
          dateFrom: rawDateFrom.replace(/-/g, ""),
          dateTo: rawDateTo.replace(/-/g, ""),
          direction,
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded", isRateLimit: true },
          { status: 429, headers: NO_STORE_HEADERS }
        );
      }

      return NextResponse.json(
        { error: `API error: ${error.status}`, message: "API request failed" },
        { status: error.status, headers: NO_STORE_HEADERS }
      );
    }

    console.error("[ESPN API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", message: errorMessage(error) },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
