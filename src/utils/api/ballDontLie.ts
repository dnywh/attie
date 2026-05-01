import { BalldontlieAPI } from "@balldontlie/sdk";

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
