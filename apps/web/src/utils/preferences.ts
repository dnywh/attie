import { DEFAULTS } from "@/constants/defaults";
import {
  COMPETITIONS,
  getDefaultCompetitionsForSport,
  isCompetitionKey,
} from "@/constants/competitions";
import { isSportKey } from "@/config/sportConfig";
import type { CompetitionKey, Direction, SportKey, StoredPreferences } from "@/types/domain";

export const STORAGE_KEYS = {
  sport: "attie.sport",
  direction: "attie.direction",
  sound: "attie.sound",
  competitionsForSport: (sport: SportKey) => `attie.competitions.${sport}`,
} as const;

const isDirection = (value: string | null): value is Direction =>
  value === "forwards" || value === "backwards";

const parseCompetitionList = (
  value: string | null,
  sport: SportKey
): CompetitionKey[] => {
  const fallback = (): CompetitionKey[] => {
    const defaultCompetitions = getDefaultCompetitionsForSport(sport);
    return defaultCompetitions.length > 0
      ? defaultCompetitions
      : [...DEFAULTS.COMPETITIONS];
  };

  if (!value || value === "[]") {
    return fallback();
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return fallback();
    }

    const competitions = parsed.filter(
      (competition): competition is CompetitionKey =>
        isCompetitionKey(competition) && COMPETITIONS[competition].sport === sport
    );
    return competitions.length > 0 ? competitions : fallback();
  } catch {
    return fallback();
  }
};

export function getStoredCompetitionsForSport(
  storage: Storage,
  sport: SportKey
): CompetitionKey[] {
  return parseCompetitionList(
    storage.getItem(STORAGE_KEYS.competitionsForSport(sport)),
    sport
  );
}

export function getStoredPreferences(storage?: Storage): StoredPreferences {
  if (!storage) {
    return {
      sport: DEFAULTS.SPORT,
      competitions: [...DEFAULTS.COMPETITIONS],
      direction: DEFAULTS.DIRECTION,
    };
  }

  const storedSport = storage.getItem(STORAGE_KEYS.sport);
  const sport = isSportKey(storedSport) ? storedSport : DEFAULTS.SPORT;
  const competitions = getStoredCompetitionsForSport(storage, sport);
  const storedDirection = storage.getItem(STORAGE_KEYS.direction);

  return {
    sport,
    competitions,
    direction: isDirection(storedDirection) ? storedDirection : DEFAULTS.DIRECTION,
  };
}

export function getBrowserPreferences(): StoredPreferences {
  return getStoredPreferences(
    typeof window === "undefined" ? undefined : window.localStorage
  );
}

export function initialiseStorage(storage: Storage): void {
  if (!storage.getItem(STORAGE_KEYS.sport)) {
    storage.setItem(STORAGE_KEYS.sport, DEFAULTS.SPORT);
    storage.setItem(
      STORAGE_KEYS.competitionsForSport(DEFAULTS.SPORT),
      JSON.stringify(DEFAULTS.COMPETITIONS)
    );
  }

  if (!storage.getItem(STORAGE_KEYS.direction)) {
    storage.setItem(STORAGE_KEYS.direction, DEFAULTS.DIRECTION);
  }
}

export function readStoredSoundPreference(storage?: Storage): boolean {
  if (!storage) {
    return DEFAULTS.SOUND;
  }

  const value = storage.getItem(STORAGE_KEYS.sound);

  if (value === null) {
    return DEFAULTS.SOUND;
  }

  try {
    return Boolean(JSON.parse(value));
  } catch {
    return DEFAULTS.SOUND;
  }
}
