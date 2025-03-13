"use client";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { Fieldset, Legend } from "@headlessui/react";

import Fixture from "@/components/Fixture";
import FancyDropdown from "@/components/FancyDropdown";
import HeadingBanner from "@/components/HeadingBanner";
import Button from "@/components/Button";
import FieldsetItems from "@/components/FieldsetItems";
import InputLabel from "@/components/InputLabel";
import InputGroup from "@/components/InputGroup";
import LoadingText from "@/components/LoadingText";
import SelectionExplainerText from "@/components/SelectionExplainerText";
import Interstitial from "@/components/Interstitial";

import { COMPETITIONS } from "@/constants/competitions";
import { dashedBorder } from "@/styles/commonStyles";
import { formatDateForDisplay, groupFixturesByDate } from "@/utils/dates";
import { useFixtures } from "@/hooks/useFixtures";

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

  return (
    <Main>
      <ControlBar>
        <FancyDropdown
          icon="⚽️"
          label={
            selectedCompetitions.length
              ? selectedCompetitions.join(", ")
              : "Nothing selected"
          }
          count={selectedCompetitions.length}
          fillSpace={true}
        >
          <>
            <StyledFieldset>
              <HeadingBanner as="label" htmlFor="sport">
                1. Sport
              </HeadingBanner>
              <Select name="sport" id="sport">
                <option value="football">Football</option>
              </Select>
            </StyledFieldset>

            <StyledFieldset>
              <HeadingBanner as={Legend}>2. Competitions</HeadingBanner>
              <FieldsetItems>
                {Object.entries(COMPETITIONS)
                  .filter(([, competition]) => competition.tier !== "paid")
                  .map(([competitionId, competition]) => (
                    <InputGroup
                      key={competitionId}
                      data-active={
                        selectedCompetitions.includes(competitionId)
                          ? true
                          : undefined
                      }
                    >
                      <input
                        type="checkbox"
                        id={competitionId}
                        name={competitionId}
                        checked={selectedCompetitions.includes(competitionId)}
                        onChange={(e) => handleCompetitionChange(e.target.name)}
                      />
                      <InputLabel htmlFor={competitionId}>
                        {competition.name}
                      </InputLabel>
                    </InputGroup>
                  ))}
              </FieldsetItems>
            </StyledFieldset>
            <SelectionExplainerText>
              Are we missing your favourite sport or competition?{" "}
              <Link href="mailto:?body=Please replace the email address with 'hello' at this domain.">
                Let us know
              </Link>
              .
            </SelectionExplainerText>
          </>
        </FancyDropdown>
        {!showFutureFixtures && (
          <FancyDropdown icon={showAllScores ? "👀" : "⚫️"}>
            <StyledFieldset>
              <HeadingBanner as={Legend}>Score visibility</HeadingBanner>
              <FieldsetItems>
                <InputGroup>
                  <input
                    type="radio"
                    id="hide-scores"
                    name="score-visibility"
                    value="hidden"
                    checked={!showAllScores}
                    onChange={() => setShowAllScores(false)}
                  />
                  <InputLabel htmlFor="hide-scores">Hide all scores</InputLabel>
                </InputGroup>

                <InputGroup>
                  <input
                    type="radio"
                    id="show-scores"
                    name="score-visibility"
                    value="visible"
                    checked={showAllScores}
                    onChange={() => setShowAllScores(true)}
                  />
                  <InputLabel htmlFor="show-scores">Show all scores</InputLabel>
                </InputGroup>
              </FieldsetItems>
            </StyledFieldset>
            {!showAllScores && (
              <StyledFieldset>
                <HeadingBanner as={Legend}>Sound effects</HeadingBanner>
                <FieldsetItems>
                  <InputGroup>
                    <input
                      type="radio"
                      id="sound-on"
                      name="sound-effects"
                      value="audible"
                      checked={useSoundEffects}
                      onChange={() => setUseSoundEffects(true)}
                    />
                    <InputLabel htmlFor="sound-on">Sound on</InputLabel>
                  </InputGroup>
                  <InputGroup>
                    <input
                      type="radio"
                      id="sound-off"
                      name="sound-effects"
                      value="muted"
                      checked={!useSoundEffects}
                      onChange={() => setUseSoundEffects(false)}
                    />
                    <InputLabel htmlFor="sound-off">Sound off</InputLabel>
                  </InputGroup>
                </FieldsetItems>
              </StyledFieldset>
            )}
            <SelectionExplainerText>
              {showAllScores
                ? "Reveals all scores, just like any other sports results app (Seriously?)."
                : "Hides all scores. Tap the black circles to reveal individual scores."}
            </SelectionExplainerText>
          </FancyDropdown>
        )}
        <FancyDropdown icon={showFutureFixtures ? "🗓️" : "🕥"}>
          <StyledFieldset>
            <HeadingBanner as={Legend}>Fixture direction</HeadingBanner>
            <FieldsetItems>
              <InputGroup>
                <input
                  type="radio"
                  id="backward-fixtures"
                  name="fixture-direction"
                  value="backwards"
                  checked={!showFutureFixtures}
                  onChange={() => setShowFutureFixtures(false)}
                />
                <InputLabel htmlFor="backward-fixtures">Backwards</InputLabel>
              </InputGroup>

              <InputGroup>
                <input
                  type="radio"
                  id="forward-fixtures"
                  name="fixture-direction"
                  value="forwards"
                  checked={showFutureFixtures}
                  onChange={() => setShowFutureFixtures(true)}
                />
                <InputLabel htmlFor="forward-fixtures">Forwards</InputLabel>
              </InputGroup>
            </FieldsetItems>
          </StyledFieldset>
          <SelectionExplainerText>
            {showFutureFixtures
              ? "Shows upcoming fixtures, from today into to the future."
              : "Shows in-progress or finished fixtures, from today back."}
          </SelectionExplainerText>
        </FancyDropdown>
      </ControlBar>

      <section>
        {loading ? (
          <EmptyState>
            <SelectionExplainerText>
              <LoadingText>Loading fixtures</LoadingText>
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
  backgroundColor: theme.colors.mid.secondary,
  overflowX: "hidden",

  border: `1px solid ${theme.colors.text.primary}`,
  boxShadow: `0 3px 0 0 ${theme.colors.text.primary}`,
  borderRadius: "3px",
}));

const Select = styled("select")({
  width: "100%",
  padding: "0.5rem",
});

const StyledFieldset = styled(Fieldset)({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem", // 4px gap
});

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
