import type { ComponentType } from "react";
import type { FixtureStatusType } from "@/constants/fixtureStatus";

export type Direction = "forwards" | "backwards";
export type ApiDirection = "future" | "past";

export type AdapterType =
  | "espn"
  | "football-data"
  | "balldontlie-nba"
  | "balldontlie-mlb"
  | "balldontlie-nfl";

export type SportKey =
  | "american-football"
  | "aussie-rules"
  | "baseball"
  | "basketball"
  | "football"
  | "rugby-league"
  | "rugby-union";

export type CompetitionKey =
  | "afl"
  | "nrl"
  | "premier-league"
  | "fa-cup"
  | "championship"
  | "champions-league"
  | "europa-league"
  | "la-liga"
  | "serie-a"
  | "bundesliga"
  | "ligue-1"
  | "liga-portugal"
  | "eredivisie"
  | "brasileirao"
  | "nba"
  | "wnba"
  | "college-basketball-men"
  | "college-basketball-women"
  | "mlb"
  | "college-baseball"
  | "nfl"
  | "college-football"
  | "super-rugby"
  | "united-rugby-championship";

export interface SportConfig {
  name: string;
  localName?: string;
  icon: ComponentType;
}

export interface EspnCompetitionApi {
  adapter: "espn";
  sport: string;
  league: string;
  groups?: number;
  limit?: number;
}

export interface FootballDataCompetitionApi {
  adapter: "football-data";
  code: string;
}

export interface BallDontLieCompetitionApi {
  adapter: "balldontlie-nba" | "balldontlie-mlb" | "balldontlie-nfl";
}

export type CompetitionApi =
  | EspnCompetitionApi
  | FootballDataCompetitionApi
  | BallDontLieCompetitionApi;

export interface CompetitionConfig {
  sport: SportKey;
  name: string;
  defaultForSport?: boolean;
  api: CompetitionApi;
}

export interface StoredPreferences {
  sport: SportKey;
  competitions: CompetitionKey[];
  direction: Direction;
}

export type ScoreValue = number | string | null;

export interface StatusObject {
  type: FixtureStatusType | string;
  detail: string | null;
}

export interface CommonFixture {
  id: string;
  utcDate: string;
  status: StatusObject;
  competition: {
    name: string;
  };
  homeTeam: {
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: ScoreValue;
      away: ScoreValue;
    };
  };
}

export type FixtureWithLocalDate = CommonFixture & {
  localDate: Date;
};
