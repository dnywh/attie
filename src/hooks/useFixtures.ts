import { useCallback, useEffect, useRef, useState } from "react";
import {
  COMPETITIONS,
  getDefaultCompetitionForSport,
  isCompetitionKey,
} from "@/constants/competitions";
import { DEFAULTS } from "@/constants/defaults";
import { ADAPTER_BASE_PATHS, adaptFixture } from "@/utils/adapters";
import { DEFAULT_WINDOWS, type DateWindow } from "@/utils/config/windows";
import { sortFixtures } from "@/utils/dates";
import {
  STORAGE_KEYS,
  getBrowserPreferences,
  getStoredCompetitionsForSport,
  initialiseStorage,
} from "@/utils/preferences";
import { isSportKey } from "@/config/sportConfig";
import type {
  ApiDirection,
  CommonFixture,
  CompetitionConfig,
  CompetitionKey,
  Direction,
  SportKey,
  StoredPreferences,
} from "@/types/domain";

export { getBrowserPreferences as getStoredPreferences } from "@/utils/preferences";

export interface FixtureParams {
  sport?: SportKey | string | null;
  competitions?: CompetitionKey[] | string[] | string | null;
  direction?: Direction | string | null;
}

interface BuildApiParams {
  dateFrom: string;
  dateTo: string;
  direction: ApiDirection;
  cursor?: number | null;
  page?: number;
}

const isDirection = (value: string | null | undefined): value is Direction =>
  value === "forwards" || value === "backwards";

const browserStorage = (): Storage | undefined =>
  typeof window === "undefined" ? undefined : window.localStorage;

const defaultCompetitionForSport = (sport: SportKey): CompetitionKey => {
  const defaultCompetition = getDefaultCompetitionForSport(sport);

  if (!defaultCompetition) {
    console.warn(`No default competition found for sport: ${sport}`);
    return DEFAULTS.COMPETITIONS[0];
  }

  return defaultCompetition;
};

const parseCompetitionParam = (
  competitions: FixtureParams["competitions"]
): string[] | undefined => {
  if (!competitions) {
    return undefined;
  }

  return typeof competitions === "string"
    ? competitions.split(",").filter(Boolean)
    : competitions;
};

const normaliseCompetitions = (
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
    : [defaultCompetitionForSport(sport)];
};

const normaliseInitialParams = (initialParams?: FixtureParams): StoredPreferences => {
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
        : [defaultCompetitionForSport(sport)],
  };
};

const buildApiUrl = (
  competition: CompetitionConfig,
  params: BuildApiParams
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

  if (params.cursor) {
    queryParams.set("cursor", String(params.cursor));
  }

  if (params.page) {
    queryParams.set("page", String(params.page));
  }

  return `${basePath}?${queryParams.toString()}`;
};

const isRateLimitError = (error: unknown): boolean =>
  error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED";

export function useFixtures(initialParams?: FixtureParams) {
  const initialPreferences = normaliseInitialParams(initialParams);
  const [selectedDirection, setSelectedDirection] = useState<Direction>(
    initialPreferences.direction
  );
  const [selectedSport, setSelectedSport] = useState<SportKey>(
    initialPreferences.sport
  );
  const [selectedCompetitions, setSelectedCompetitions] = useState<
    CompetitionKey[]
  >(initialPreferences.competitions);
  const [fixtures, setFixtures] = useState<CommonFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [hasRateLimitError, setHasRateLimitError] = useState(false);
  const [dateWindow, setDateWindow] = useState<DateWindow>(() => ({
    start: DEFAULT_WINDOWS.INITIAL.PAST.start,
    end:
      selectedDirection === "forwards"
        ? DEFAULT_WINDOWS.INITIAL.FUTURE.end
        : DEFAULT_WINDOWS.INITIAL.PAST.end,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  const loadAttemptsRef = useRef(0);

  const handleSportChange = useCallback((newSport: SportKey) => {
    const storage = browserStorage();
    const newCompetitionsForSport = storage
      ? getStoredCompetitionsForSport(storage, newSport)
      : [defaultCompetitionForSport(newSport)];

    setSelectedSport(newSport);
    storage?.setItem(STORAGE_KEYS.sport, newSport);
    setSelectedCompetitions(newCompetitionsForSport);
    storage?.setItem(
      STORAGE_KEYS.competitionsForSport(newSport),
      JSON.stringify(newCompetitionsForSport)
    );
    setFixtures([]);
    setCurrentPage(1);
    setHasReachedEnd(false);
  }, []);

  useEffect(() => {
    const storage = browserStorage();

    if (storage) {
      initialiseStorage(storage);
    }
  }, []);

  const fetchFixturesForCompetition = useCallback(
    async (
      competitionKey: CompetitionKey,
      customDateWindow: DateWindow,
      cursor: number | null = null
    ): Promise<CommonFixture[]> => {
      const competition = COMPETITIONS[competitionKey];
      const currentDate = new Date();
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);

      if (selectedDirection === "forwards") {
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(currentDate.getDate() + customDateWindow.end);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate.setDate(currentDate.getDate() - customDateWindow.start);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      const dateFrom = startDate.toISOString().split("T")[0];
      const dateTo = endDate.toISOString().split("T")[0];
      const adjustedDateTo =
        competition.api.adapter === "espn"
          ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : dateTo;

      try {
        const response = await fetch(
          buildApiUrl(competition, {
            dateFrom,
            dateTo: adjustedDateTo,
            direction: selectedDirection === "forwards" ? "future" : "past",
            cursor,
            page: currentPage,
          })
        );

        if (!response.ok) {
          throw new Error(
            response.status === 429 ? "RATE_LIMIT_EXCEEDED" : `API error: ${response.status}`
          );
        }

        const data: { matches?: unknown[]; events?: unknown[] } =
          await response.json();
        const fixtureArray = data.matches || data.events || [];

        if (!Array.isArray(fixtureArray)) {
          console.error("Expected array of fixtures, got:", fixtureArray);
          return [];
        }

        return fixtureArray
          .map((match) => adaptFixture(match, competitionKey))
          .filter((fixture): fixture is CommonFixture => Boolean(fixture));
      } catch (error) {
        console.error("[Fetch] Error:", error);
        throw error;
      }
    },
    [selectedDirection, currentPage]
  );

  const handleLoadMore = useCallback(
    async (currentWindow = dateWindow) => {
      if (loadAttemptsRef.current >= DEFAULT_WINDOWS.MAX_ATTEMPTS) {
        console.log("[Load More] Max attempts reached");
        setHasReachedEnd(true);
        return;
      }

      setLoadingMore(true);

      try {
        const increment = DEFAULT_WINDOWS.INCREMENT.DAYS;
        let nextWindow = { ...currentWindow };

        while (loadAttemptsRef.current < DEFAULT_WINDOWS.MAX_ATTEMPTS) {
          loadAttemptsRef.current += 1;
          console.log(
            "[Load More] Starting load more with attempts:",
            loadAttemptsRef.current
          );

          const newWindow = { ...nextWindow };

          if (selectedDirection === "forwards") {
            newWindow.start = newWindow.end;
            newWindow.end += increment;
          } else {
            newWindow.end = newWindow.start;
            newWindow.start += increment;
          }

          console.log("[Load More] New date window:", newWindow);

          const newMatches = await Promise.all(
            selectedCompetitions.map((competitionKey) =>
              fetchFixturesForCompetition(competitionKey, newWindow)
            )
          );
          const allNewMatches = newMatches.flat();

          console.log("[Load More] Found new matches:", allNewMatches.length);

          if (allNewMatches.length > 0) {
            setFixtures((previousFixtures) => {
              const combined = [...previousFixtures, ...allNewMatches];
              const unique = Array.from(
                new Map(combined.map((fixture) => [fixture.id, fixture])).values()
              );
              return sortFixtures(unique, selectedDirection);
            });
            setDateWindow(newWindow);
            loadAttemptsRef.current = 0;
            return;
          }

          nextWindow = newWindow;
        }

        console.log("[Load More] Max attempts reached");
        setHasReachedEnd(true);
      } catch (error) {
        console.error("[Load More] Error:", error);

        if (isRateLimitError(error)) {
          setHasRateLimitError(true);
        }
      } finally {
        setLoadingMore(false);
      }
    },
    [
      dateWindow,
      selectedDirection,
      selectedCompetitions,
      fetchFixturesForCompetition,
    ]
  );

  const loadInitialFixtures = useCallback(async () => {
    setLoading(true);
    setFixtures([]);
    setHasReachedEnd(false);
    setHasRateLimitError(false);
    loadAttemptsRef.current = 0;

    try {
      const initialWindow =
        selectedDirection === "forwards"
          ? DEFAULT_WINDOWS.INITIAL.FUTURE
          : DEFAULT_WINDOWS.INITIAL.PAST;

      setDateWindow(initialWindow);

      const matches = await Promise.all(
        selectedCompetitions.map((competitionKey) =>
          fetchFixturesForCompetition(competitionKey, initialWindow)
        )
      );
      const allMatches = matches.flat();

      if (allMatches.length === 0) {
        console.log("[Initial Load] No fixtures found, attempting to load more");
        await handleLoadMore(initialWindow);
      } else {
        setFixtures(sortFixtures(allMatches, selectedDirection));
      }
    } catch (error) {
      console.error("[Initial Load] Error:", error);

      if (isRateLimitError(error)) {
        setHasRateLimitError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [
    fetchFixturesForCompetition,
    handleLoadMore,
    selectedCompetitions,
    selectedDirection,
  ]);

  const hasSelectedCompetitions = selectedCompetitions.length > 0;

  useEffect(() => {
    let shouldLoad = true;

    if (hasSelectedCompetitions) {
      queueMicrotask(() => {
        if (shouldLoad) {
          loadInitialFixtures();
        }
      });
    }

    return () => {
      shouldLoad = false;
    };
  }, [hasSelectedCompetitions, loadInitialFixtures]);

  const handleCompetitionChange = useCallback(
    async (competitionKey: CompetitionKey) => {
      setLoading(true);

      try {
        let newSelectedCompetitions: CompetitionKey[];

        if (selectedCompetitions.includes(competitionKey)) {
          newSelectedCompetitions = selectedCompetitions.filter(
            (selectedCompetition) => selectedCompetition !== competitionKey
          );
          setSelectedCompetitions(newSelectedCompetitions);

          setFixtures((previousFixtures) =>
            previousFixtures.filter((fixture) => {
              const fixtureCompetitionKey = Object.entries(COMPETITIONS).find(
                ([, competition]) => competition.name === fixture.competition.name
              )?.[0] as CompetitionKey | undefined;

              return fixtureCompetitionKey
                ? newSelectedCompetitions.includes(fixtureCompetitionKey)
                : false;
            })
          );
        } else {
          newSelectedCompetitions = [...selectedCompetitions, competitionKey];
          setSelectedCompetitions(newSelectedCompetitions);

          const newMatches = await fetchFixturesForCompetition(
            competitionKey,
            dateWindow
          );
          console.log("[Competition Change] New matches fetched:", newMatches.length);

          setFixtures((previousFixtures) => {
            const combined = [...previousFixtures, ...newMatches];
            const unique = Array.from(
              new Map(combined.map((fixture) => [fixture.id, fixture])).values()
            );
            return sortFixtures(unique, selectedDirection);
          });
        }

        browserStorage()?.setItem(
          STORAGE_KEYS.competitionsForSport(selectedSport),
          JSON.stringify(newSelectedCompetitions)
        );
      } catch (error) {
        console.error("[Competition Change] Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      dateWindow,
      fetchFixturesForCompetition,
      selectedCompetitions,
      selectedDirection,
      selectedSport,
    ]
  );

  return {
    fixtures,
    loading,
    loadingMore,
    hasReachedEnd,
    hasRateLimitError,
    selectedDirection,
    selectedSport,
    selectedCompetitions,
    setSelectedDirection,
    setSelectedSport: handleSportChange,
    handleCompetitionChange,
    handleLoadMore,
  };
}
