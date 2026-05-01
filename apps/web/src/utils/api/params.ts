import { isCompetitionKey } from "@/constants/competitions";
import type { ApiDirection, CompetitionKey } from "@/types/domain";

type ParamResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function requiredParam(searchParams: URLSearchParams, name: string): ParamResult<string> {
  const value = searchParams.get(name);

  if (!value) {
    return { ok: false, error: `Missing required "${name}" parameter` };
  }

  return { ok: true, value };
}

export function optionalNumberParam(
  searchParams: URLSearchParams,
  name: string
): ParamResult<number | undefined> {
  const value = searchParams.get(name);

  if (!value) {
    return { ok: true, value: undefined };
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return { ok: false, error: `"${name}" must be a positive integer` };
  }

  return { ok: true, value: parsed };
}

export function dateRangeParams(
  searchParams: URLSearchParams
): ParamResult<{ dateFrom: string; dateTo: string }> {
  const dateFrom = requiredParam(searchParams, "dateFrom");
  if (!dateFrom.ok) return dateFrom;

  const dateTo = requiredParam(searchParams, "dateTo");
  if (!dateTo.ok) return dateTo;

  if (!ISO_DATE_PATTERN.test(dateFrom.value) || !ISO_DATE_PATTERN.test(dateTo.value)) {
    return {
      ok: false,
      error: '"dateFrom" and "dateTo" must use YYYY-MM-DD format',
    };
  }

  return {
    ok: true,
    value: {
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
    },
  };
}

export function espnParams(searchParams: URLSearchParams): ParamResult<{
  dateFrom: string;
  dateTo: string;
  direction: string | null;
  sport: string;
  league: string;
  groups: string | null;
  limit: string | null;
}> {
  const dateRange = dateRangeParams(searchParams);
  if (!dateRange.ok) return dateRange;

  const sport = requiredParam(searchParams, "sport");
  if (!sport.ok) return sport;

  const league = requiredParam(searchParams, "league");
  if (!league.ok) return league;

  return {
    ok: true,
    value: {
      ...dateRange.value,
      direction: searchParams.get("direction"),
      sport: sport.value,
      league: league.value,
      groups: searchParams.get("groups"),
      limit: searchParams.get("limit"),
    },
  };
}

export function footballDataParams(searchParams: URLSearchParams): ParamResult<{
  dateFrom: string;
  dateTo: string;
  direction: string | null;
  competitionCode: string;
}> {
  const dateRange = dateRangeParams(searchParams);
  if (!dateRange.ok) return dateRange;

  const competition = requiredParam(searchParams, "competition");
  if (!competition.ok) return competition;

  return {
    ok: true,
    value: {
      ...dateRange.value,
      direction: searchParams.get("direction"),
      competitionCode: competition.value,
    },
  };
}

export function ballDontLieParams(searchParams: URLSearchParams): ParamResult<{
  dateFrom: string;
  dateTo: string;
  direction: string | null;
  cursor: number | undefined;
}> {
  const dateRange = dateRangeParams(searchParams);
  if (!dateRange.ok) return dateRange;

  const cursor = optionalNumberParam(searchParams, "cursor");
  if (!cursor.ok) return cursor;

  return {
    ok: true,
    value: {
      ...dateRange.value,
      direction: searchParams.get("direction"),
      cursor: cursor.value,
    },
  };
}

const normaliseCompetitionParams = (searchParams: URLSearchParams): string[] => {
  const singularValues = searchParams
    .getAll("competition")
    .flatMap((value) => value.split(","));
  const pluralValues = searchParams.get("competitions")?.split(",") ?? [];

  return [...singularValues, ...pluralValues]
    .map((value) => value.trim())
    .filter(Boolean);
};

const apiDirectionParam = (
  value: string | null
): ParamResult<ApiDirection> => {
  if (!value) {
    return { ok: true, value: "past" };
  }

  if (value === "past" || value === "future") {
    return { ok: true, value };
  }

  return { ok: false, error: '"direction" must be either "past" or "future"' };
};

export function fixturesParams(searchParams: URLSearchParams): ParamResult<{
  competitionKeys: CompetitionKey[];
  cursor: number | undefined;
  dateFrom: string;
  dateTo: string;
  direction: ApiDirection;
}> {
  const dateRange = dateRangeParams(searchParams);
  if (!dateRange.ok) return dateRange;

  const direction = apiDirectionParam(searchParams.get("direction"));
  if (!direction.ok) return direction;

  const cursor = optionalNumberParam(searchParams, "cursor");
  if (!cursor.ok) return cursor;

  const competitionValues = normaliseCompetitionParams(searchParams);

  if (competitionValues.length === 0) {
    return { ok: false, error: 'Missing required "competition" parameter' };
  }

  const competitionKeys = competitionValues.filter(isCompetitionKey);

  if (competitionKeys.length !== competitionValues.length) {
    return { ok: false, error: 'Unknown "competition" parameter' };
  }

  if (cursor.value !== undefined && competitionKeys.length > 1) {
    return {
      ok: false,
      error: '"cursor" can only be used with one competition at a time',
    };
  }

  return {
    ok: true,
    value: {
      ...dateRange.value,
      competitionKeys,
      cursor: cursor.value,
      direction: direction.value,
    },
  };
}
