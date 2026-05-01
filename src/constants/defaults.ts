import type { CompetitionKey, Direction, SportKey } from "@/types/domain";

export const DEFAULTS = {
  SPORT: "football",
  COMPETITIONS: ["premier-league"], // Keep to single as we assume a singular defaultCompetition in useFixtures
  DIRECTION: "backwards",
  SOUND: false,
} as const satisfies {
  SPORT: SportKey;
  COMPETITIONS: CompetitionKey[];
  DIRECTION: Direction;
  SOUND: boolean;
};
