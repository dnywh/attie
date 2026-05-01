import { useEffect } from "react";
import { DEFAULTS } from "@/constants/defaults";
import { STORAGE_KEYS } from "@/utils/preferences";
import type { FixtureParams } from "@/hooks/useFixtures";
import type { CompetitionKey, Direction, SportKey } from "@/types/domain";

const arraysEqual = <T,>(
  first?: readonly T[] | null,
  second?: readonly T[] | null
): boolean => {
  if (!first || !second) {
    return first === second;
  }

  return (
    first.length === second.length &&
    first.every((item, index) => item === second[index])
  );
};

const competitionsForComparison = (
  competitions: FixtureParams["competitions"]
): string[] => {
  if (!competitions) {
    return [];
  }

  return typeof competitions === "string"
    ? competitions.split(",").filter(Boolean)
    : competitions;
};

interface UseFixtureUrlSyncParams {
  initialParams?: FixtureParams;
  isClient: boolean;
  selectedCompetitions: CompetitionKey[];
  selectedDirection: Direction;
  selectedSport: SportKey;
}

export const useFixtureUrlSync = ({
  initialParams,
  isClient,
  selectedCompetitions,
  selectedDirection,
  selectedSport,
}: UseFixtureUrlSyncParams) => {
  useEffect(() => {
    if (!isClient) {
      return;
    }

    const params = new URLSearchParams();
    const isCompetitionPage = window.location.pathname !== "/";

    if (isCompetitionPage) {
      localStorage.setItem(STORAGE_KEYS.sport, selectedSport);
      localStorage.setItem(
        STORAGE_KEYS.competitionsForSport(selectedSport),
        JSON.stringify(selectedCompetitions)
      );
    }

    if (
      isCompetitionPage &&
      initialParams &&
      !arraysEqual(
        selectedCompetitions,
        competitionsForComparison(initialParams.competitions)
      )
    ) {
      if (selectedSport !== initialParams.sport) {
        params.set("sport", selectedSport);
      }

      params.set("competitions", selectedCompetitions.join(","));

      if (selectedDirection !== DEFAULTS.DIRECTION) {
        params.set("direction", selectedDirection);
      }

      window.history.replaceState(
        {},
        "",
        params.toString() ? `/?${params}` : "/"
      );
      return;
    }

    const compareAgainst =
      isCompetitionPage && initialParams
        ? initialParams
        : {
            sport: DEFAULTS.SPORT,
            competitions: DEFAULTS.COMPETITIONS,
            direction: DEFAULTS.DIRECTION,
          };

    const shouldUpdateUrl =
      isCompetitionPage ||
      selectedSport !== DEFAULTS.SPORT ||
      !arraysEqual(selectedCompetitions, DEFAULTS.COMPETITIONS) ||
      selectedDirection !== DEFAULTS.DIRECTION;

    if (shouldUpdateUrl) {
      if (selectedSport !== compareAgainst.sport) {
        params.set("sport", selectedSport);
      }

      if (
        !arraysEqual(
          selectedCompetitions,
          competitionsForComparison(compareAgainst.competitions)
        )
      ) {
        params.set("competitions", selectedCompetitions.join(","));
      }

      if (selectedDirection !== compareAgainst.direction) {
        params.set("direction", selectedDirection);
      }

      const basePath = isCompetitionPage ? window.location.pathname : "/";
      window.history.replaceState(
        {},
        "",
        params.toString() ? `${basePath}?${params}` : basePath
      );
    } else if (!isCompetitionPage) {
      window.history.replaceState({}, "", "/");
    }
  }, [
    initialParams,
    isClient,
    selectedCompetitions,
    selectedDirection,
    selectedSport,
  ]);
};
