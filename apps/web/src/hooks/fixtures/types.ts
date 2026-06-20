import type {
  ApiDirection,
  CommonFixture,
  CompetitionKey,
  Direction,
  SportKey,
} from "@/types/domain";

export interface FixtureParams {
  sport?: SportKey | string | null;
  competitions?: CompetitionKey[] | string[] | string | null;
  direction?: Direction | string | null;
}

export interface FixtureDateWindow {
  fromOffset: number;
  toOffset: number;
}

export interface FixtureDateRange {
  dateFrom: string;
  dateTo: string;
}

export interface FixtureApiMeta {
  next_cursor: number | null;
  per_page: number | null;
  has_more: boolean;
}

export interface FixtureBatch {
  fixtures: CommonFixture[];
  meta: FixtureApiMeta;
}

export interface BuildFixtureApiUrlParams extends FixtureDateRange {
  direction: ApiDirection;
  cursor?: number | null;
  refreshToken?: string | null;
}
