import {
  COMPETITIONS,
  getDefaultCompetitionsForSport,
  isCompetitionKey,
} from "@/constants/competitions";
import { DEFAULTS } from "@/constants/defaults";
import { isSportKey } from "@/config/sportConfig";
import {
  getBrowserPreferences,
  getStoredCompetitionsForSport,
} from "@/utils/preferences";
import type {
  CompetitionKey,
  Direction,
  SportKey,
  StoredPreferences,
} from "@/types/domain";
import type { FixtureParams } from "./types";

export const isDirection = (
  value: string | null | undefined
): value is Direction => value === "forwards" || value === "backwards";

export const browserStorage = (): Storage | undefined =>
  typeof window === "undefined" ? undefined : window.localStorage;

export const defaultCompetitionsForSport = (
  sport: SportKey
): CompetitionKey[] => {
  const defaultCompetitions = getDefaultCompetitionsForSport(sport);

  if (defaultCompetitions.length === 0) {
    console.warn(`No default competition found for sport: ${sport}`);
    return [...DEFAULTS.COMPETITIONS];
  }

  return defaultCompetitions;
};

export const parseCompetitionParam = (
  competitions: FixtureParams["competitions"]
): string[] | undefined => {
  if (!competitions) {
    return undefined;
  }

  return typeof competitions === "string"
    ? competitions.split(",").filter(Boolean)
    : competitions;
};

export const normaliseCompetitions = (
  competitions: FixtureParams["competitions"],
  sport: SportKey
): CompetitionKey[] | undefined => {
  const competitionKeys = parseCompetitionParam(competitions);

  if (!competitionKeys) {
    return undefined;
  }

  const validCompetitions = competitionKeys.filter(
    (competition): competition is CompetitionKey =>
      isCompetitionKey(competition) && COMPETITIONS[competition].sport === sport
  );

  return validCompetitions.length > 0
    ? validCompetitions
    : defaultCompetitionsForSport(sport);
};

export const normaliseInitialParams = (
  initialParams?: FixtureParams
): StoredPreferences => {
  const storedPreferences = getBrowserPreferences();
  const storage = browserStorage();
  const explicitSport = initialParams?.sport;
  let sport: SportKey = storedPreferences.sport;
  let hasExplicitSport = false;

  if (isSportKey(explicitSport)) {
    sport = explicitSport;
    hasExplicitSport = true;
  }

  const direction = isDirection(initialParams?.direction)
    ? initialParams.direction
    : storedPreferences.direction;
  const explicitCompetitions = normaliseCompetitions(
    initialParams?.competitions,
    sport
  );

  if (explicitCompetitions) {
    return {
      sport,
      direction,
      competitions: explicitCompetitions,
    };
  }

  if (hasExplicitSport && storage) {
    return {
      sport,
      direction,
      competitions: getStoredCompetitionsForSport(storage, sport),
    };
  }

  return {
    sport,
    direction,
    competitions:
      storedPreferences.sport === sport
        ? storedPreferences.competitions
        : defaultCompetitionsForSport(sport),
  };
};
