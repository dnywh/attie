"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FancyDropdown from "@/components/FancyDropdown";
import FixturesBackwardIcon from "@/components/FixturesBackwardIcon";
import LoadingText from "@/components/LoadingText";
import RadioDotIcon from "@/components/RadioDotIcon";
import ScoresHiddenIcon from "@/components/ScoresHiddenIcon";
import SelectionExplainerText from "@/components/SelectionExplainerText";
import { SPORTS } from "@/config/sportConfig";
import { STORAGE_KEYS, readStoredSoundPreference } from "@/utils/preferences";
import { onFixtureRefresh } from "@/utils/fixtureRefreshEvents";
import { useFixtures } from "@/hooks/useFixtures";
import type { FixtureParams } from "@/hooks/useFixtures";
import type { Direction, SportKey } from "@/types/domain";
import FixtureControls from "./FixtureControls";
import FixturesList from "./FixturesList";
import { ControlBar, EmptyState, Main } from "./styles";
import { useClientHydration } from "./useClientHydration";
import { useFixtureUrlSync } from "./useFixtureUrlSync";

const sportIcon = (sport: SportKey) => {
  const SportIcon = SPORTS[sport].icon;

  return <SportIcon />;
};

export default function FixturesClient({
  initialParams,
}: {
  initialParams?: FixtureParams;
}) {
  const isClient = useClientHydration();
  const [showAllScores, setShowAllScores] = useState(false);
  const [useSoundEffects, setUseSoundEffects] = useState(() =>
    readStoredSoundPreference(
      typeof window === "undefined" ? undefined : window.localStorage
    )
  );
  const searchParams = useSearchParams();
  const urlParams: FixtureParams = {
    sport: searchParams?.get("sport"),
    competitions: searchParams?.get("competitions")?.split(","),
    direction: searchParams?.get("direction"),
  };
  const params = initialParams ?? urlParams;
  const {
    fixtures,
    loading,
    loadingMore,
    refreshing,
    hasReachedEnd,
    hasRateLimitError,
    selectedDirection,
    selectedSport,
    setSelectedSport,
    selectedCompetitions,
    setSelectedDirection,
    handleCompetitionChange,
    handleLoadMore,
    refreshFixtures,
  } = useFixtures(params);
  const selectedSportIcon = sportIcon(selectedSport);

  useFixtureUrlSync({
    initialParams,
    isClient,
    selectedCompetitions,
    selectedDirection,
    selectedSport,
  });

  useEffect(() => {
    if (!isClient) {
      return;
    }

    return onFixtureRefresh(refreshFixtures);
  }, [isClient, refreshFixtures]);

  const handleSoundEffectsChange = (newValue: boolean) => {
    setUseSoundEffects(newValue);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.sound, JSON.stringify(newValue));
    }
  };

  const handleDirectionChange = (newValue: boolean) => {
    const newDirection: Direction = newValue ? "forwards" : "backwards";

    setSelectedDirection(newDirection);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.direction, newDirection);
    }
  };

  if (!isClient) {
    return (
      <Main>
        <ControlBar>
          <FancyDropdown
            icon={<RadioDotIcon />}
            label="Loading..."
            fillSpace={true}
          />
          <FancyDropdown icon={<ScoresHiddenIcon />} />
          <FancyDropdown icon={<FixturesBackwardIcon />} />
        </ControlBar>
        <EmptyState>
          <SelectionExplainerText>
            <LoadingText>Loading fixtures</LoadingText>
          </SelectionExplainerText>
        </EmptyState>
      </Main>
    );
  }

  return (
    <Main>
      <FixtureControls
        selectedCompetitions={selectedCompetitions}
        selectedDirection={selectedDirection}
        selectedSport={selectedSport}
        showAllScores={showAllScores}
        sportIcon={selectedSportIcon}
        useSoundEffects={useSoundEffects}
        onCompetitionChange={handleCompetitionChange}
        onDirectionChange={handleDirectionChange}
        onScoreVisibilityChange={setShowAllScores}
        onSoundEffectsChange={handleSoundEffectsChange}
        onSportChange={setSelectedSport}
      />

      <FixturesList
        fixtures={fixtures}
        hasRateLimitError={hasRateLimitError}
        hasReachedEnd={hasReachedEnd}
        loading={loading}
        loadingMore={loadingMore || refreshing}
        selectedCompetitions={selectedCompetitions}
        selectedDirection={selectedDirection}
        showAllScores={showAllScores}
        useSoundEffects={useSoundEffects}
        onLoadMore={handleLoadMore}
      />
    </Main>
  );
}
