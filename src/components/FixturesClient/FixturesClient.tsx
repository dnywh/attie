"use client";
import {
  useState,
  useEffect,
  Fragment,
  useSyncExternalStore,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Legend } from "@headlessui/react";
import Select from "@/components/Select";
import Fixture from "@/components/Fixture";
import FancyDropdown from "@/components/FancyDropdown";
import HeadingBanner from "@/components/HeadingBanner";
import Button from "@/components/Button";
import Fieldset from "@/components/Fieldset";
import FieldCheckboxRow from "@/components/FieldCheckboxRow";
import FieldRadioRow from "@/components/FieldRadioRow";
import RadioGroup from "@/components/RadioGroup";
import CheckboxGroup from "@/components/CheckboxGroup";
import LoadingText from "@/components/LoadingText";
import SelectionExplainerText from "@/components/SelectionExplainerText";
import Interstitial from "@/components/Interstitial";

import {
  COMPETITIONS,
  getCompetitionsForSport,
} from "@/constants/competitions";
import { SPORTS, isSportKey } from "@/config/sportConfig";

import { dashedBorder, interstitialStippledBackground } from "@/styles/commonStyles";
import { formatDateForDisplay, groupFixturesByDate } from "@/utils/dates";
import { useFixtures } from "@/hooks/useFixtures";
import type { FixtureParams } from "@/hooks/useFixtures";
import { STORAGE_KEYS, readStoredSoundPreference } from "@/utils/preferences";
import type {
  CompetitionConfig,
  CompetitionKey,
  Direction,
  SportKey,
} from "@/types/domain";

import ScoresHiddenIcon from "@/components/ScoresHiddenIcon";
import ScoresRevealedIcon from "@/components/ScoresRevealedIcon";
import FixturesBackwardIcon from "@/components/FixturesBackwardIcon";
import FixturesForwardIcon from "@/components/FixturesForwardIcon";
import RadioDotIcon from "@/components/RadioDotIcon"; // Placeholder for sport icon when loading

import { styled } from "next-yak";
import { DEFAULTS } from "@/constants/defaults";
import { webTheme } from "@/styles/theme.yak";

const subscribeToClientHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function FixturesClient({
  initialParams,
}: {
  initialParams?: FixtureParams;
}) {
  const isClient = useSyncExternalStore(
    subscribeToClientHydration,
    getClientSnapshot,
    getServerSnapshot
  );
  const [showAllScores, setShowAllScores] = useState(false);
  const [useSoundEffects, setUseSoundEffects] = useState(() =>
    readStoredSoundPreference(
      typeof window === "undefined" ? undefined : window.localStorage
    )
  );
  const searchParams = useSearchParams();

  // Get URL params, but prioritize initialParams if they exist
  const urlParams: FixtureParams = {
    sport: searchParams?.get("sport"),
    competitions: searchParams?.get("competitions")?.split(","),
    direction: searchParams?.get("direction"),
  };

  // Use initialParams if provided (for dynamic routes), otherwise use URL params
  const params = initialParams || urlParams;

  // Pass relevant params to useFixtures
  const {
    fixtures,
    loading,
    loadingMore,
    hasReachedEnd,
    hasRateLimitError,
    selectedDirection,
    selectedSport,
    setSelectedSport,
    selectedCompetitions,
    setSelectedDirection,
    handleCompetitionChange,
    handleLoadMore,
  } = useFixtures(params);

  // Filter competitions based on selected sport
  const availableCompetitions = Object.entries(
    getCompetitionsForSport(selectedSport)
  ) as [CompetitionKey, CompetitionConfig][];

  // Handle icon component for selected sport
  const getSportIcon = (sport: SportKey): ReactNode => {
    const SportIcon = SPORTS[sport]?.icon;
    return SportIcon ? <SportIcon /> : <RadioDotIcon />;
  };

  const selectedSportIcon = getSportIcon(selectedSport);

  // Helper function to compare arrays with null safety
  function arraysEqual<T>(a?: readonly T[] | null, b?: readonly T[] | null) {
    // Handle cases where either array is undefined/null
    if (!a || !b) return a === b;
    if (a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
  }

  function competitionsForComparison(
    competitions: FixtureParams["competitions"]
  ): string[] {
    if (!competitions) {
      return [];
    }

    return typeof competitions === "string"
      ? competitions.split(",").filter(Boolean)
      : competitions;
  }

  // Update the URL params comparison logic
  useEffect(() => {
    if (!isClient) return; // Don't update URL during SSR

    const params = new URLSearchParams();
    const isCompetitionPage = window.location.pathname !== "/";

    // If we're on a competition page, assume the visitor wants this to be their new default for Attie (as well as the competition's sport)
    if (isCompetitionPage) {
      localStorage.setItem("attie.sport", selectedSport);
      localStorage.setItem(
        `attie.competitions.${selectedSport}`,
        JSON.stringify(selectedCompetitions)
      );
    }

    // If we're on a competition page and trying to change a param (another competition, sport, or just the direction),
    // redirect to the home page with the new params
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

    // For the homepage, only add params if they differ from defaults
    // For competition pages, compare against initialParams
    const compareAgainst = isCompetitionPage && initialParams
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

      // Use the current path if we're on a competition page, otherwise use root
      const basePath = isCompetitionPage ? window.location.pathname : "/";
      window.history.replaceState(
        {},
        "",
        params.toString() ? `${basePath}?${params}` : basePath
      );
    } else if (!isCompetitionPage) {
      // If we're on the homepage and everything matches defaults, ensure clean URL
      window.history.replaceState({}, "", "/");
    }
  }, [
    selectedSport,
    selectedCompetitions,
    selectedDirection,
    isClient,
    initialParams,
  ]);

  // Handle sound preference changes
  const handleSoundEffectsChange = (newValue: boolean) => {
    setUseSoundEffects(newValue);
    // Only attempt to use localStorage on the client
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.sound, JSON.stringify(newValue));
    }
  };

  const handleDirectionChange = (newValue: boolean) => {
    const newDirection: Direction = newValue ? "forwards" : "backwards";
    setSelectedDirection(newDirection);
    // Only attempt to use localStorage on the client
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.direction, newDirection);
    }
  };

  // Prevent hydration mismatch by not rendering dynamic content on server
  // I.e. render same static loading content by default on both server and client
  if (!isClient) {
    return (
      <Main>
        <ControlBar>
          <FancyDropdown
            icon={<RadioDotIcon />} // Fallback icon on SSR. TODO: Make a proper sunburst logospinner and/or placeholder sport icon
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

  // Then, on client, re-render with dynamic content once available
  return (
    <Main>
      <ControlBar>
        <FancyDropdown
          icon={selectedSportIcon}
          label={
            selectedCompetitions.length
              ? selectedCompetitions
                  .map((id) => COMPETITIONS[id].name)
                  .join(", ")
              : "Nothing selected"
          }
          count={selectedCompetitions.length}
          fillSpace={true}
        >
          <>
            <Fieldset>
              <HeadingBanner as="label" htmlFor="sport">
                1. Sport
              </HeadingBanner>
              <Select
                id="sport"
                name="sport"
                value={selectedSport}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  if (isSportKey(event.target.value)) {
                    setSelectedSport(event.target.value);
                  }
                }}
              >
                {Object.entries(SPORTS).map(([sportKey, sport]) => (
                  <option key={sportKey} value={sportKey}>
                    {sport.name}
                  </option>
                ))}
              </Select>
            </Fieldset>

            <Fieldset>
              <HeadingBanner as={Legend}>2. Competitions</HeadingBanner>
              <CheckboxGroup>
                {availableCompetitions.map(([competitionId, competition]) => (
                  <FieldCheckboxRow
                    icon={selectedSportIcon}
                    key={competitionId}
                    name={competitionId}
                    checked={selectedCompetitions.includes(competitionId)}
                    onChange={() => handleCompetitionChange(competitionId)}
                  >
                    {competition.name}
                  </FieldCheckboxRow>
                ))}
              </CheckboxGroup>
            </Fieldset>
            <SelectionExplainerText>
              Are we missing your favourite sport or competition?{" "}
              <Link href="mailto:?body=Please replace the email address with `danny` at this domain.">
                Let us know
              </Link>
              .
            </SelectionExplainerText>
          </>
        </FancyDropdown>

        {selectedDirection === "backwards" && (
          <FancyDropdown
            icon={showAllScores ? <ScoresRevealedIcon /> : <ScoresHiddenIcon />}
          >
            <Fieldset>
              <HeadingBanner as={Legend}>Score visibility</HeadingBanner>
              <RadioGroup
                value={showAllScores}
                onChange={setShowAllScores}
                aria-label="Score visibility"
              >
                <FieldRadioRow value={false}>Hide all scores</FieldRadioRow>
                <FieldRadioRow value={true}>Show all scores</FieldRadioRow>
              </RadioGroup>
            </Fieldset>

            <Fieldset>
              <HeadingBanner as={Legend}>Sound effects</HeadingBanner>
              <RadioGroup
                value={useSoundEffects}
                onChange={handleSoundEffectsChange}
                aria-label="Sound effects"
                disabled={showAllScores}
              >
                <FieldRadioRow value={true}>Sound on</FieldRadioRow>
                <FieldRadioRow value={false}>Sound off</FieldRadioRow>
              </RadioGroup>
            </Fieldset>
            <SelectionExplainerText>
              {showAllScores
                ? "Reveals all scores, just like any other sports results app. Boring!"
                : "Hides all scores. Tap the black circles to reveal individual scores."}
            </SelectionExplainerText>
          </FancyDropdown>
        )}
        <FancyDropdown
          icon={
            selectedDirection === "forwards" ? (
              <FixturesForwardIcon />
            ) : (
              <FixturesBackwardIcon />
            )
          }
        >
          <Fieldset>
            <HeadingBanner as={Legend}>Fixture direction</HeadingBanner>
            <RadioGroup
              value={selectedDirection === "forwards"}
              onChange={handleDirectionChange}
              aria-label="Fixture direction"
            >
              <FieldRadioRow value={false}>Backwards</FieldRadioRow>
              <FieldRadioRow value={true}>Forwards</FieldRadioRow>
            </RadioGroup>
          </Fieldset>
          <SelectionExplainerText>
            {selectedDirection === "forwards"
              ? "Shows upcoming fixtures, from today into the future."
              : "Shows in-progress or finished fixtures, from today back."}
          </SelectionExplainerText>
        </FancyDropdown>
      </ControlBar>

      <section>
        {loading ? (
          <EmptyState>
            <SelectionExplainerText>
              <LoadingText>
                Loading {selectedDirection === "forwards" && "upcoming"}{" "}
                fixtures
              </LoadingText>
            </SelectionExplainerText>
          </EmptyState>
        ) : fixtures?.length > 0 ? (
          <AllFixturesList>
            {Object.entries(
              groupFixturesByDate(
                fixtures.filter((fixture) => {
                  const fixtureDate = new Date(fixture.utcDate);
                  const now = new Date();
                  return selectedDirection === "forwards"
                    ? fixtureDate >= now
                    : fixtureDate <= now;
                })
              )
            ).map(([groupingKey, dateFixtures], index) => {
              const firstFixture = dateFixtures[0];

              if (!firstFixture) {
                return null;
              }

              return (
                <Fragment key={groupingKey}>
                  <DateGroup>
                    <HeadingBanner sticky="true">
                      {formatDateForDisplay(firstFixture.localDate)}
                    </HeadingBanner>
                    <DateFixturesList>
                      {dateFixtures.map((fixture) => (
                        <Fixture
                          key={fixture.id}
                          fixture={fixture}
                          showAllScores={showAllScores}
                          useSoundEffects={useSoundEffects}
                          showCompetition={selectedCompetitions.length > 1}
                        />
                      ))}
                    </DateFixturesList>
                  </DateGroup>
                  {index === 1 && (
                    <Interstitial
                      linkUrl="https://www.dannywhite.net/"
                      linkText="Reach out"
                    >
                      <p>
                        Attie is lovingly crafted by product designer{" "}
                        {/* TODO: Use (i.e. automate) same link params as in Interstitial component footer */}
                        <Link
                          href="https://www.dannywhite.net/?utm_source=attie&utm_medium=sponsorship"
                          target="_blank"
                        >
                          Danny White
                        </Link>
                        . Got a product that needs making? Get Danny involved.
                      </p>
                    </Interstitial>
                  )}
                </Fragment>
              );
            })}

            {(() => {
              // console.log(
              //   `[Render] hasReachedEnd: ${hasReachedEnd}, fixtures length: ${fixtures.length}`
              // );
              return !hasReachedEnd ? (
                <Button onClick={() => handleLoadMore()} disabled={loadingMore}>
                  {loadingMore ? (
                    <LoadingText>Loading</LoadingText>
                  ) : (
                    "Load more"
                  )}
                </Button>
              ) : (
                <EmptyState>
                  <SelectionExplainerText>
                    {hasRateLimitError
                      ? "Rate limit reached. Please try again in a minute."
                      : "End of fixtures list"}
                  </SelectionExplainerText>
                </EmptyState>
              );
            })()}
          </AllFixturesList>
        ) : (
          <EmptyState>
            <SelectionExplainerText>
              {!selectedCompetitions.length
                ? "Select a competition from above"
                : `No fixtures found across the ${
                    selectedDirection === "forwards"
                      ? `next few months`
                      : `last few months`
                  }`}
            </SelectionExplainerText>
          </EmptyState>
        )}
      </section>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ControlBar = styled.section`
  ${interstitialStippledBackground};
  align-items: center;
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 3px;
  box-shadow: 0 3px 0 0 ${webTheme.colors.text.primary};
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  overflow-x: hidden;
  padding: 0.5rem;
`;

const AllFixturesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DateGroup = styled.li`
  ${dashedBorder};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateFixturesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  ${dashedBorder};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
