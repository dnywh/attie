import { NextResponse } from "next/server";
import { fixturesParams, errorMessage } from "@/utils/api/params";
import { fetchFixtureBatchForDateRange } from "@/hooks/fixtures/api";
import { sortFixtures } from "@/utils/dates";
import type {
  ApiDirection,
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
          }
        )
      )
    );
    const fixtures = sortFixtures(
      batches.flatMap((batch) => batch.fixtures),
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
