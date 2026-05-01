import { BalldontlieAPI } from "@balldontlie/sdk";
import { generateDateRange } from "@/utils/dates";

let api: BalldontlieAPI | null = null;

export function getBallDontLieApi(): BalldontlieAPI {
  if (!api) {
    api = new BalldontlieAPI({
      apiKey: process.env.BALL_DONT_LIE_API_KEY ?? "",
    });
  }

  return api;
}

export function paginationMeta(meta?: { next_cursor: number; per_page: number }) {
  return {
    next_cursor: meta?.next_cursor ?? null,
    per_page: meta?.per_page ?? null,
    has_more: Boolean(meta?.next_cursor),
  };
}

interface BallDontLieGamesResponse {
  data: unknown[];
  meta?: {
    next_cursor: number;
    per_page: number;
  };
}

interface FetchBallDontLieGamesOptions<TParams extends Record<string, unknown>> {
  cursor?: number;
  dateFrom: string;
  dateTo: string;
  dateMode: "range" | "dates";
  getGames: (params: TParams) => Promise<BallDontLieGamesResponse>;
  perPage: number;
}

export async function fetchBallDontLieGames<
  TParams extends Record<string, unknown>,
>({
  cursor,
  dateFrom,
  dateMode,
  dateTo,
  getGames,
  perPage,
}: FetchBallDontLieGamesOptions<TParams>) {
  const dateParams =
    dateMode === "range"
      ? {
          start_date: dateFrom,
          end_date: dateTo,
        }
      : {
          dates: generateDateRange(dateFrom, dateTo),
        };
  const response = await getGames({
    ...dateParams,
    per_page: perPage,
    ...(cursor && { cursor }),
  } as unknown as TParams);

  return {
    matches: response.data,
    meta: paginationMeta(response.meta),
  };
}
