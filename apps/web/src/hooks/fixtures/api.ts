import { COMPETITIONS } from "@/constants/competitions";
import { ADAPTER_BASE_PATHS, adaptFixture } from "@/utils/adapters";
import { addDaysToDateString, padDateRange } from "@/utils/fixtureTime";
import { dateRangeForAdapter } from "./windows";
import type {
  CommonFixture,
  CompetitionConfig,
  CompetitionKey,
  Direction,
  FixtureListResponse,
} from "@/types/domain";
import type {
  BuildFixtureApiUrlParams,
  FixtureApiMeta,
  FixtureBatch,
  FixtureDateWindow,
} from "./types";

const EMPTY_META: FixtureApiMeta = {
  next_cursor: null,
  per_page: null,
  has_more: false,
};

const MAX_CURSOR_PAGES = 10;

export type FixturePayload = {
  matches?: unknown;
  events?: unknown;
  meta?: Partial<FixtureApiMeta>;
};

type FixtureFetch = typeof fetch;

export const buildFixtureApiUrl = (
  competition: CompetitionConfig,
  params: BuildFixtureApiUrlParams
): string => {
  const adapterType = competition.api.adapter;
  const basePath = ADAPTER_BASE_PATHS[adapterType];
  const queryParams = new URLSearchParams();

  queryParams.set("dateFrom", params.dateFrom);
  queryParams.set("dateTo", params.dateTo);
  queryParams.set("direction", params.direction);

  if (competition.api.adapter === "football-data") {
    queryParams.set("competition", competition.api.code);
  } else if (competition.api.adapter === "espn") {
    queryParams.set("sport", competition.api.sport);
    queryParams.set("league", competition.api.league);

    if (competition.api.groups) {
      queryParams.set("groups", String(competition.api.groups));
    }

    if (competition.api.limit) {
      queryParams.set("limit", String(competition.api.limit));
    }
  }

  if (typeof params.cursor === "number") {
    queryParams.set("cursor", String(params.cursor));
  }

  if (params.refreshToken) {
    queryParams.set("_refresh", params.refreshToken);
  }

  return `${basePath}?${queryParams.toString()}`;
};

export const buildFixturesFacadeUrl = (
  competitionKey: CompetitionKey,
  params: BuildFixtureApiUrlParams
): string => {
  const queryParams = new URLSearchParams();

  queryParams.set("competition", competitionKey);
  queryParams.set("dateFrom", params.dateFrom);
  queryParams.set("dateTo", params.dateTo);
  queryParams.set("direction", params.direction);

  if (typeof params.cursor === "number") {
    queryParams.set("cursor", String(params.cursor));
  }

  if (params.refreshToken) {
    queryParams.set("_refresh", params.refreshToken);
  }

  if (params.timeZone) {
    queryParams.set("timeZone", params.timeZone);
  }

  return `/api/fixtures?${queryParams.toString()}`;
};

const parseFixtureMeta = (meta?: Partial<FixtureApiMeta>): FixtureApiMeta => ({
  next_cursor: meta?.next_cursor ?? null,
  per_page: meta?.per_page ?? null,
  has_more: Boolean(meta?.has_more || meta?.next_cursor),
});

const fixtureArrayFromPayload = (data: FixturePayload): unknown[] => {
  const fixtureArray = data.matches ?? data.events ?? [];

  return Array.isArray(fixtureArray) ? fixtureArray : [];
};

export const adaptFixturePayload = (
  data: FixturePayload,
  competitionKey: CompetitionKey
): FixtureBatch => ({
  fixtures: fixtureArrayFromPayload(data)
    .map((match) => adaptFixture(match, competitionKey))
    .filter((fixture): fixture is CommonFixture => Boolean(fixture)),
  meta: parseFixtureMeta(data.meta),
});

const PROVIDER_DATE_PADDING = {
  before: 1,
  after: 1,
};

const dateRangeForAdapterDateRange = (
  range: { dateFrom: string; dateTo: string },
  adapter: string
): { dateFrom: string; dateTo: string } =>
  adapter === "espn"
    ? {
        ...range,
        dateTo: addDaysToDateString(range.dateTo, 1),
      }
    : range;

const currentTimeZone = (): string | null => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
};

export const fetchFixtureBatchForDateRange = async (
  competitionKey: CompetitionKey,
  range: { dateFrom: string; dateTo: string },
  direction: Direction,
  options: {
    cursor?: number | null;
    fetcher?: FixtureFetch;
    refreshToken?: string | null;
  } = {}
): Promise<FixtureBatch> => {
  const competition = COMPETITIONS[competitionKey];
  const paddedRange = padDateRange(range, PROVIDER_DATE_PADDING);
  const dateRange = dateRangeForAdapterDateRange(
    paddedRange,
    competition.api.adapter
  );
  const url = buildFixtureApiUrl(competition, {
    ...dateRange,
    direction: direction === "forwards" ? "future" : "past",
    cursor: options.cursor,
    refreshToken: options.refreshToken,
  });
  const response = await (options.fetcher ?? fetch)(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "RATE_LIMIT_EXCEEDED"
        : `API error: ${response.status} for ${url}`
    );
  }

  return adaptFixturePayload((await response.json()) as FixturePayload, competitionKey);
};

export const fetchFixtureBatch = async (
  competitionKey: CompetitionKey,
  window: FixtureDateWindow,
  direction: Direction,
  options: {
    cursor?: number | null;
    fetcher?: FixtureFetch;
    refreshToken?: string | null;
    today?: Date;
  } = {}
): Promise<FixtureBatch> => {
  const competition = COMPETITIONS[competitionKey];
  const dateRange = dateRangeForAdapter(
    window,
    competition.api.adapter,
    options.today
  );
  return fetchFixtureBatchForDateRange(competitionKey, dateRange, direction, options);
};

export const fetchFixtureFacadeBatch = async (
  competitionKey: CompetitionKey,
  window: FixtureDateWindow,
  direction: Direction,
  options: {
    cursor?: number | null;
    fetcher?: FixtureFetch;
    refreshToken?: string | null;
    today?: Date;
  } = {}
): Promise<FixtureBatch> => {
  const dateRange = dateRangeForAdapter(window, "facade", options.today);
  const url = buildFixturesFacadeUrl(competitionKey, {
    ...dateRange,
    direction: direction === "forwards" ? "future" : "past",
    cursor: options.cursor,
    refreshToken: options.refreshToken,
    timeZone: currentTimeZone(),
  });
  const response = await (options.fetcher ?? fetch)(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "RATE_LIMIT_EXCEEDED"
        : `API error: ${response.status} for ${url}`
    );
  }

  const data = (await response.json()) as FixtureListResponse;

  return {
    fixtures: data.fixtures,
    meta: parseFixtureMeta(data.meta),
  };
};

export const fetchFixtureWindow = async (
  competitionKeys: CompetitionKey[],
  window: FixtureDateWindow,
  direction: Direction,
  options: {
    fetcher?: FixtureFetch;
    refreshToken?: string | null;
    today?: Date;
  } = {}
): Promise<CommonFixture[]> => {
  const batches = await Promise.all(
    competitionKeys.map(async (competitionKey) => {
      const fixtures: CommonFixture[] = [];
      let cursor: number | null = null;
      let pagesFetched = 0;

      do {
        const batch = await fetchFixtureFacadeBatch(competitionKey, window, direction, {
          ...options,
          cursor,
        });

        fixtures.push(...batch.fixtures);
        cursor = batch.meta.next_cursor;
        pagesFetched += 1;
      } while (cursor && pagesFetched < MAX_CURSOR_PAGES);

      return fixtures;
    })
  );

  return batches.flat();
};
