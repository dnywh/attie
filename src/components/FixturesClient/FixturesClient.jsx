"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
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
  SPORTS,
  getCompetitionsForSport,
} from "@/constants/competitions";
import { dashedBorder } from "@/styles/commonStyles";
import { formatDateForDisplay, groupFixturesByDate } from "@/utils/dates";
import { useFixtures } from "@/hooks/useFixtures";

import ScoresHiddenIcon from "@/components/ScoresHiddenIcon";
import ScoresRevealedIcon from "@/components/ScoresRevealedIcon";
import FixturesBackwardIcon from "@/components/FixturesBackwardIcon";
import FixturesForwardIcon from "@/components/FixturesForwardIcon";
import FootballIcon from "@/components/FootballIcon";
import BasketballIcon from "@/components/BasketballIcon";

import { styled } from "@pigment-css/react";

export default function FixturesClient() {
  // Basic state
  const [showAllScores, setShowAllScores] = useState(false);
  const [useSoundEffects, setUseSoundEffects] = useState(true);
  // More complicated state via useFixtures hook
  const {
    fixtures,
    loading,
    loadingMore,
    hasReachedEnd,
    hasRateLimitError,
    showFutureFixtures,
    selectedSport,
    setSelectedSport,
    selectedCompetitions,
    setShowFutureFixtures,
    handleCompetitionChange,
    handleLoadMore,
    loadInitialFixtures,
  } = useFixtures();

  // Initial load
  useEffect(() => {
    loadInitialFixtures();
  }, [showFutureFixtures]);

  // Filter competitions based on selected sport
  const availableCompetitions = Object.entries(
    getCompetitionsForSport(selectedSport)
  ).filter(([, competition]) => competition.tier !== "paid");

  const selectedSportIcon =
    selectedSport === "basketball" ? <BasketballIcon /> : <FootballIcon />;

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
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                {Object.values(SPORTS).map((sport) => (
                  <option
                    key={sport}
                    value={sport}
                    disabled={
                      sport !== SPORTS.FOOTBALL && sport !== SPORTS.BASKETBALL
                    }
                  >
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
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

        {!showFutureFixtures && (
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
                onChange={setUseSoundEffects}
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
            showFutureFixtures ? (
              <FixturesForwardIcon />
            ) : (
              <FixturesBackwardIcon />
            )
          }
        >
          <Fieldset>
            <HeadingBanner as={Legend}>Fixture direction</HeadingBanner>
            <RadioGroup
              value={showFutureFixtures}
              onChange={setShowFutureFixtures}
              aria-label="Fixture direction"
            >
              <FieldRadioRow value={false}>Backwards</FieldRadioRow>
              <FieldRadioRow value={true}>Forwards</FieldRadioRow>
            </RadioGroup>
          </Fieldset>
          <SelectionExplainerText>
            {showFutureFixtures
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
                Loading {showFutureFixtures && "upcoming"} fixtures
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
                  return showFutureFixtures
                    ? fixtureDate >= now
                    : fixtureDate <= now;
                })
              )
            ).map(([groupingKey, dateFixtures], index, array) => (
              <Fragment key={groupingKey}>
                <DateGroup>
                  <HeadingBanner sticky="true">
                    {formatDateForDisplay(dateFixtures[0].localDate)}
                  </HeadingBanner>
                  <DateFixturesList>
                    {dateFixtures.map((fixture) => (
                      <Fixture
                        key={fixture.id}
                        fixture={fixture}
                        showAllScores={showAllScores}
                        useSoundEffects={useSoundEffects}
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
                      Attie is lovingly crafted by one-man-band,{" "}
                      <Link href="https://www.dannywhite.net/" target="_blank">
                        Danny White
                      </Link>
                      . Got an idea that needs making? Get Danny involved.
                    </p>
                  </Interstitial>
                )}
              </Fragment>
            ))}

            {(() => {
              console.log(
                `[Render] hasReachedEnd: ${hasReachedEnd}, fixtures length: ${fixtures.length}`
              );
              return !hasReachedEnd ? (
                <Button onClick={handleLoadMore} disabled={loadingMore}>
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
                ? "Select at least one competition from above"
                : "No fixtures found"}
            </SelectionExplainerText>
          </EmptyState>
        )}
      </section>
    </Main>
  );
}

const Main = styled("main")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const ControlBar = styled("section")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  padding: "0.5rem",
  alignItems: "center",
  backgroundColor: theme.colors.background.interstitial,
  overflowX: "hidden",

  border: `1px solid ${theme.colors.text.primary}`,
  boxShadow: `0 3px 0 0 ${theme.colors.text.primary}`,
  borderRadius: "3px",
}));

const AllFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const DateGroup = styled("li")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem", // Between header and another ul
  ...dashedBorder({ theme }),
}));

const DateFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const EmptyState = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  ...dashedBorder({ theme }),
}));
