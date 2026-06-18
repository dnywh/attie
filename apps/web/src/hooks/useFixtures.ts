import { useCallback, useEffect, useRef, useState } from "react";
import { COMPETITIONS } from "@/constants/competitions";
import { DEFAULT_WINDOWS } from "@/utils/config/windows";
import {
  STORAGE_KEYS,
  getBrowserPreferences,
  getStoredCompetitionsForSport,
  initialiseStorage,
} from "@/utils/preferences";
import { fetchFixtureWindow } from "@/hooks/fixtures/api";
import { mergeFixtures } from "@/hooks/fixtures/merge";
import {
  browserStorage,
  defaultCompetitionsForSport,
  normaliseInitialParams,
} from "@/hooks/fixtures/params";
import {
  initialFixtureWindow,
  nextFixtureWindow,
} from "@/hooks/fixtures/windows";
import type {
  CommonFixture,
  CompetitionKey,
  Direction,
  SportKey,
} from "@/types/domain";
import type { FixtureDateWindow, FixtureParams } from "@/hooks/fixtures/types";

export type { FixtureParams } from "@/hooks/fixtures/types";
export { getBrowserPreferences as getStoredPreferences } from "@/utils/preferences";

type FixtureStateUpdater =
  | CommonFixture[]
  | ((fixtures: CommonFixture[]) => CommonFixture[]);

const isRateLimitError = (error: unknown): boolean =>
  error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED";

const competitionNames = (competitionKeys: CompetitionKey[]): Set<string> =>
  new Set(
    competitionKeys.map((competitionKey) => COMPETITIONS[competitionKey].name)
  );

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
  const selectedCompetitionsRef = useRef<CompetitionKey[]>(
    initialPreferences.competitions
  );
  const [fixtures, setFixturesState] = useState<CommonFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [hasRateLimitError, setHasRateLimitError] = useState(false);
  const fixturesRef = useRef<CommonFixture[]>([]);
  const dateWindowRef = useRef<FixtureDateWindow>(
    initialFixtureWindow(initialPreferences.direction)
  );
  const loadAttemptsRef = useRef(0);
  const refreshInFlightRef = useRef(false);
  const fixtureRequestIdRef = useRef(0);

  const setFixtures = useCallback((nextFixtures: FixtureStateUpdater) => {
    const resolvedFixtures =
      typeof nextFixtures === "function"
        ? nextFixtures(fixturesRef.current)
        : nextFixtures;

    fixturesRef.current = resolvedFixtures;
    setFixturesState(resolvedFixtures);
  }, [setFixturesState]);

  const resetPagingState = useCallback(() => {
    setHasReachedEnd(false);
    setHasRateLimitError(false);
    loadAttemptsRef.current = 0;
  }, [setHasRateLimitError, setHasReachedEnd]);

  const appendFixtures = useCallback(
    (incomingFixtures: CommonFixture[]): number => {
      const merged = mergeFixtures(
        fixturesRef.current,
        incomingFixtures,
        selectedDirection
      );

      if (merged.changedCount > 0) {
        setFixtures(merged.fixtures);
      }

      return merged.changedCount;
    },
    [selectedDirection, setFixtures]
  );

  const handleSportChange = useCallback(
    (newSport: SportKey) => {
      const storage = browserStorage();
      const newCompetitionsForSport = storage
        ? getStoredCompetitionsForSport(storage, newSport)
        : defaultCompetitionsForSport(newSport);

      setLoading(true);
      fixtureRequestIdRef.current += 1;
      setSelectedSport(newSport);
      storage?.setItem(STORAGE_KEYS.sport, newSport);
      selectedCompetitionsRef.current = newCompetitionsForSport;
      setSelectedCompetitions(newCompetitionsForSport);
      storage?.setItem(
        STORAGE_KEYS.competitionsForSport(newSport),
        JSON.stringify(newCompetitionsForSport)
      );
      setFixtures([]);
      dateWindowRef.current = initialFixtureWindow(selectedDirection);
      resetPagingState();
    },
    [
      resetPagingState,
      selectedDirection,
      setFixtures,
      setLoading,
      setSelectedCompetitions,
      setSelectedSport,
    ]
  );

  const handleDirectionChange = useCallback(
    (newDirection: Direction) => {
      setLoading(true);
      fixtureRequestIdRef.current += 1;
      setSelectedDirection(newDirection);
      setFixtures([]);
      dateWindowRef.current = initialFixtureWindow(newDirection);
      resetPagingState();
    },
    [
      resetPagingState,
      setFixtures,
      setLoading,
      setSelectedDirection,
    ]
  );

  useEffect(() => {
    const storage = browserStorage();

    if (storage) {
      initialiseStorage(storage);
    }
  }, []);

  const handleLoadMore = useCallback(
    async (currentWindow = dateWindowRef.current) => {
      if (loadAttemptsRef.current >= DEFAULT_WINDOWS.MAX_ATTEMPTS) {
        setHasReachedEnd(true);
        return;
      }

      setLoadingMore(true);
      const requestId = fixtureRequestIdRef.current;

      try {
        let nextWindow = currentWindow;

        while (loadAttemptsRef.current < DEFAULT_WINDOWS.MAX_ATTEMPTS) {
          loadAttemptsRef.current += 1;
          const candidateWindow = nextFixtureWindow(
            nextWindow,
            selectedDirection
          );
          const fetchedFixtures = await fetchFixtureWindow(
            selectedCompetitions,
            candidateWindow,
            selectedDirection
          );

          if (requestId !== fixtureRequestIdRef.current) {
            return;
          }

          const addedCount = appendFixtures(fetchedFixtures);

          dateWindowRef.current = candidateWindow;

          if (addedCount > 0) {
            loadAttemptsRef.current = 0;
            return;
          }

          nextWindow = candidateWindow;
        }

        setHasReachedEnd(true);
      } catch (error) {
        if (isRateLimitError(error)) {
          setHasRateLimitError(true);
        } else {
          console.error("[Load More] Error:", error);
        }
      } finally {
        if (requestId === fixtureRequestIdRef.current) {
          setLoadingMore(false);
        }
      }
    },
    [
      appendFixtures,
      selectedCompetitions,
      selectedDirection,
      setHasRateLimitError,
      setHasReachedEnd,
      setLoadingMore,
    ]
  );

  const loadInitialFixtures = useCallback(async () => {
    setLoading(true);
    setFixtures([]);
    resetPagingState();
    const requestId = fixtureRequestIdRef.current + 1;

    fixtureRequestIdRef.current = requestId;

    try {
      const initialWindow = initialFixtureWindow(selectedDirection);

      dateWindowRef.current = initialWindow;

      const fetchedFixtures = await fetchFixtureWindow(
        selectedCompetitions,
        initialWindow,
        selectedDirection
      );

      if (requestId !== fixtureRequestIdRef.current) {
        return;
      }

      if (fetchedFixtures.length === 0) {
        await handleLoadMore(initialWindow);
      } else {
        setFixtures(
          mergeFixtures([], fetchedFixtures, selectedDirection).fixtures
        );
      }
    } catch (error) {
      if (requestId !== fixtureRequestIdRef.current) {
        return;
      }

      if (isRateLimitError(error)) {
        setHasRateLimitError(true);
      } else {
        console.error("[Initial Load] Error:", error);
      }
    } finally {
      if (requestId === fixtureRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    handleLoadMore,
    resetPagingState,
    selectedCompetitions,
    selectedDirection,
    setFixtures,
    setHasRateLimitError,
    setLoading,
  ]);

  const refreshFixtures = useCallback(async () => {
    if (!selectedCompetitions.length || refreshInFlightRef.current) {
      return;
    }

    refreshInFlightRef.current = true;
    setRefreshing(true);
    setHasRateLimitError(false);

    try {
      const initialWindow = initialFixtureWindow(selectedDirection);
      const fetchedFixtures = await fetchFixtureWindow(
        selectedCompetitions,
        initialWindow,
        selectedDirection
      );
      const merged = mergeFixtures(
        fixturesRef.current,
        fetchedFixtures,
        selectedDirection
      );

      dateWindowRef.current = initialWindow;

      if (merged.changedCount > 0) {
        setFixtures(merged.fixtures);
      }
    } catch (error) {
      if (isRateLimitError(error)) {
        setHasRateLimitError(true);
      } else {
        console.error("[Refresh] Error:", error);
      }
    } finally {
      refreshInFlightRef.current = false;
      setRefreshing(false);
    }
  }, [
    selectedCompetitions,
    selectedDirection,
    setFixtures,
    setHasRateLimitError,
    setRefreshing,
  ]);

  const hasSelectedCompetitions = selectedCompetitions.length > 0;

  useEffect(() => {
    let shouldLoad = true;

    if (!hasSelectedCompetitions) {
      queueMicrotask(() => {
        if (shouldLoad) {
          setFixtures([]);
          setLoading(false);
          resetPagingState();
        }
      });

      return () => {
        shouldLoad = false;
      };
    }

    queueMicrotask(() => {
      if (shouldLoad) {
        loadInitialFixtures();
      }
    });

    return () => {
      shouldLoad = false;
    };
  }, [
    hasSelectedCompetitions,
    loadInitialFixtures,
    resetPagingState,
    setFixtures,
  ]);

  const handleCompetitionChange = useCallback(
    (competitionKey: CompetitionKey) => {
      setLoading(true);
      const currentCompetitions = selectedCompetitionsRef.current;
      const newSelectedCompetitions = currentCompetitions.includes(
        competitionKey
      )
        ? currentCompetitions.filter(
            (selectedCompetition) => selectedCompetition !== competitionKey
          )
        : [...currentCompetitions, competitionKey];

      selectedCompetitionsRef.current = newSelectedCompetitions;
      browserStorage()?.setItem(
        STORAGE_KEYS.competitionsForSport(selectedSport),
        JSON.stringify(newSelectedCompetitions)
      );

      if (newSelectedCompetitions.length < currentCompetitions.length) {
        const selectedCompetitionNames = competitionNames(
          newSelectedCompetitions
        );

        setFixtures((previousFixtures) =>
          previousFixtures.filter((fixture) =>
            selectedCompetitionNames.has(fixture.competition.name)
          )
        );
      }

      setSelectedCompetitions(newSelectedCompetitions);
    },
    [
      selectedSport,
      setFixtures,
      setLoading,
      setSelectedCompetitions,
    ]
  );

  return {
    fixtures,
    loading,
    loadingMore,
    refreshing,
    hasReachedEnd,
    hasRateLimitError,
    selectedDirection,
    selectedSport,
    selectedCompetitions,
    setSelectedDirection: handleDirectionChange,
    setSelectedSport: handleSportChange,
    handleCompetitionChange,
    handleLoadMore,
    refreshFixtures,
  };
}
