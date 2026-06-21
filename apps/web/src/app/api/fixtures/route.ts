import { NextResponse } from "next/server";
import { fixturesParams, errorMessage } from "@/utils/api/params";
import { fetchFixtureBatchForDateRange } from "@/hooks/fixtures/api";
import { sortFixtures } from "@/utils/dates";
import { isFixtureVisibleForDirection } from "@/utils/fixtureVisibility";
import type {
  ApiDirection,
  CommonFixture,
  Direction,
  FixtureApiMeta,
  FixtureListResponse,
} from "@/types/domain";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const EMPTY_META: FixtureApiMeta = {
  next_cursor: null,
  per_page: null,
  has_more: false,
};

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

const directionFromApiDirection = (direction: ApiDirection): Direction =>
  direction === "future" ? "forwards" : "backwards";

const absoluteInternalFetcher =
  (request: Request): typeof fetch =>
  (input, init) => {
    if (typeof input === "string" && input.startsWith("/")) {
      return fetch(new URL(input, request.url), {
        ...init,
        cache: "no-store",
      });
    }

    return fetch(input, {
      ...init,
      cache: "no-store",
    });
  };

const mergedMeta = (metadata: FixtureApiMeta[]): FixtureApiMeta => {
  if (metadata.length !== 1) {
    return EMPTY_META;
  }

  return metadata[0] ?? EMPTY_META;
};

const dateStringInTimeZone = (date: Date, timeZone: string): string => {
  try {
    const parts = new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "2-digit",
      timeZone,
      year: "numeric",
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((datePart) => datePart.type === type)?.value;
    const year = part("year");
    const month = part("month");
    const day = part("day");

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fall through to UTC when the caller supplies an invalid timezone.
  }

  return date.toISOString().slice(0, 10);
};

const isFixtureInRequestedRange = (
  fixture: Pick<CommonFixture, "utcDate">,
  range: { dateFrom: string; dateTo: string; timeZone: string }
): boolean => {
  const fixtureDate = dateStringInTimeZone(
    new Date(fixture.utcDate),
    range.timeZone
  );

  return fixtureDate >= range.dateFrom && fixtureDate <= range.dateTo;
};

const publicFixturesForRequest = (
  fixtures: CommonFixture[],
  {
    dateFrom,
    dateTo,
    direction,
    timeZone,
  }: {
    dateFrom: string;
    dateTo: string;
    direction: Direction;
    timeZone: string;
  }
): CommonFixture[] =>
  fixtures.filter(
    (fixture) =>
      isFixtureInRequestedRange(fixture, { dateFrom, dateTo, timeZone }) &&
      isFixtureVisibleForDirection(fixture, direction)
  );

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = fixturesParams(searchParams);

  if (!params.ok) {
    return NextResponse.json(
      { error: params.error },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const {
    competitionKeys,
    cursor,
    dateFrom,
    dateTo,
    direction: apiDirection,
  } = params.value;
  const direction = directionFromApiDirection(apiDirection);
  const timeZone = searchParams.get("timeZone") ?? "UTC";
  const refreshToken = searchParams.get("_refresh");

  try {
    const batches = await Promise.all(
      competitionKeys.map((competitionKey) =>
        fetchFixtureBatchForDateRange(
          competitionKey,
          { dateFrom, dateTo },
          direction,
          {
            cursor,
            fetcher: absoluteInternalFetcher(request),
            refreshToken,
          }
        )
      )
    );
    const fixtures = sortFixtures(
      publicFixturesForRequest(
        batches.flatMap((batch) => batch.fixtures),
        { dateFrom, dateTo, direction, timeZone }
      ),
      direction
    );
    const meta = mergedMeta(batches.map((batch) => batch.meta));
    const response = {
      fixtures,
      meta: {
        ...meta,
        count: fixtures.length,
        dateFrom,
        dateTo,
        direction: apiDirection,
        competitions: competitionKeys,
      },
    } satisfies FixtureListResponse;

    return NextResponse.json(response, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
      return NextResponse.json(
        { error: "Rate limit exceeded", isRateLimit: true },
        { status: 429, headers: NO_STORE_HEADERS }
      );
    }

    console.error("[Fixtures API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", message: errorMessage(error) },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
