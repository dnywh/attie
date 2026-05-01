import { COMPETITIONS } from "@/constants/competitions";
import { ADAPTER_BASE_PATHS, adaptFixture } from "@/utils/adapters";
import { dateRangeForAdapter } from "./windows";
import type {
  CommonFixture,
  CompetitionConfig,
  CompetitionKey,
  Direction,
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

  return `${basePath}?${queryParams.toString()}`;
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

const addDaysToDateString = (dateString: string, days: number): string => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
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

export const fetchFixtureBatchForDateRange = async (
  competitionKey: CompetitionKey,
  range: { dateFrom: string; dateTo: string },
  direction: Direction,
  options: {
    cursor?: number | null;
    fetcher?: FixtureFetch;
  } = {}
): Promise<FixtureBatch> => {
  const competition = COMPETITIONS[competitionKey];
  const dateRange = dateRangeForAdapterDateRange(range, competition.api.adapter);
  const url = buildFixtureApiUrl(competition, {
    ...dateRange,
    direction: direction === "forwards" ? "future" : "past",
    cursor: options.cursor,
  });
  const response = await (options.fetcher ?? fetch)(url);

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

export const fetchFixtureWindow = async (
  competitionKeys: CompetitionKey[],
  window: FixtureDateWindow,
  direction: Direction,
  options: {
    fetcher?: FixtureFetch;
    today?: Date;
  } = {}
): Promise<CommonFixture[]> => {
  const batches = await Promise.all(
    competitionKeys.map(async (competitionKey) => {
      const fixtures: CommonFixture[] = [];
      let cursor: number | null = null;
      let pagesFetched = 0;

      do {
        const batch = await fetchFixtureBatch(competitionKey, window, direction, {
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
