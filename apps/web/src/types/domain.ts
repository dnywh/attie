import type { ComponentType } from "react";
import type { CommonFixture } from "@attie/contracts";

export type {
  AdapterType,
  ApiDirection,
  BallDontLieCompetitionApi,
  CommonFixture,
  CompetitionApi,
  CompetitionConfig,
  CompetitionKey,
  Direction,
  EspnCompetitionApi,
  FixtureApiMeta,
  FixtureListMeta,
  FixtureListResponse,
  FootballDataCompetitionApi,
  ScoreValue,
  SportKey,
  StatusObject,
  StoredPreferences,
} from "@attie/contracts";

export interface SportConfig {
  name: string;
  localName?: string;
  icon: ComponentType;
}

export type FixtureWithLocalDate = CommonFixture & {
  localDate: Date;
};
