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
import { styled } from "@pigment-css/react";

const isDev = process.env.NODE_ENV === "development";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = "fixturesDevCache";

// Initialize cache
const fixturesCache = new Map();

// Only in development, try to restore cache from localStorage
if (isDev && typeof window !== "undefined") {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
    saved.forEach(([key, value]) => fixturesCache.set(key, value));
  } catch (e) {
    console.warn("Failed to restore cache:", e);
  }
}

const updateCache = (code, data) => {
  // Always update memory cache (both dev and prod)
  fixturesCache.set(code, {
    timestamp: Date.now(),
    data,
  });

  // Only persist to localStorage in development
  if (isDev && typeof window !== "undefined") {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify([...fixturesCache]));
    } catch (e) {
      console.warn("Failed to save cache:", e);
    }
  }
};

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

  border: `1px solid ${theme.colors.text}`,
  boxShadow: `0 3px 0 0 ${theme.colors.text}`,
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

const formatDateForDisplay = (date) => {
  const now = new Date();
  const localDate = new Date(date);

  // Convert both dates to start of day in local timezone
  const stripTime = (d) => {
    const local = new Date(d);
    local.setHours(0, 0, 0, 0);
    return local.getTime();
  };

  const dateTime = stripTime(localDate);
  const nowTime = stripTime(now);
  const dayDiff = Math.round((dateTime - nowTime) / (1000 * 60 * 60 * 24));

  // Only show Today/Yesterday for past dates
  if (dayDiff === 0) return "Today";
  if (dayDiff === -1) return "Yesterday";
  if (dayDiff === 1) return "Tomorrow";

  // All other past dates
  const suffix = getOrdinalSuffix(localDate.getDate());
  return localDate
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .replace(/(\d+)/, `$1${suffix}`);
};

const getOrdinalSuffix = (day) => {
  const j = day % 10,
    k = day % 100;
  if (j == 1 && k != 11) return "st";
  if (j == 2 && k != 12) return "nd";
  if (j == 3 && k != 13) return "rd";
  return "th";
};

const groupFixturesByDate = (fixtures) => {
  return fixtures.reduce((groups, fixture) => {
    const localDate = new Date(fixture.utcDate);
    const dayStart = new Date(localDate).setHours(0, 0, 0, 0); // Use timestamp as key

    if (!groups[dayStart]) {
      groups[dayStart] = [];
    }
    groups[dayStart].push({
      ...fixture,
      localDate,
    });
    return groups;
  }, {});
};

// Add this helper function near your other utility functions
const sortFixtures = (fixtures, showFutureFixtures) => {
  return fixtures.sort((a, b) => {
    const dateA = new Date(a.utcDate);
    const dateB = new Date(b.utcDate);
    // For past fixtures: most recent first (B-A)
    // For future fixtures: soonest first (A-B)
    return showFutureFixtures ? dateA - dateB : dateB - dateA;
  });
};

export default function FixturesClient() {
  const [showFutureFixtures, setShowFutureFixtures] = useState(false);
  const [showAllScores, setShowAllScores] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    // "premier-league",
    "champions-league",
  ]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useSoundEffects, setUseSoundEffects] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [dateWindow, setDateWindow] = useState({
    start: 7,
    end: showFutureFixtures ? 28 : 7,
  });

  const fetchFixturesForCompetition = async (
    competitionCode,
    customDateWindow,
    maxAttempts = 3
  ) => {
    const now = Date.now();
    const cacheKey = `${competitionCode}-${
      customDateWindow?.start || dateWindow.start
    }-${customDateWindow?.end || dateWindow.end}-${showFutureFixtures}`;

    // Clear cache when switching directions
    if (showFutureFixtures !== fixturesCache.get("direction")) {
      console.log("Direction changed, clearing cache");
      fixturesCache.clear();
      fixturesCache.set("direction", showFutureFixtures);
    }

    const cached = fixturesCache.get(cacheKey);

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log(`Using cached data for ${competitionCode}`);
      return cached.data;
    }

    // Calculate date range
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    const windowStart = customDateWindow?.start || dateWindow.start;
    const windowEnd = customDateWindow?.end || dateWindow.end;

    if (showFutureFixtures) {
      startDate.setHours(
        currentDate.getHours(),
        currentDate.getMinutes(),
        0,
        0
      ); // Keep current time for future fixtures
      endDate.setDate(currentDate.getDate() + windowEnd);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate.setDate(currentDate.getDate() - windowStart);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    const dateFrom = startDate.toISOString().split("T")[0];
    const dateTo = endDate.toISOString().split("T")[0];

    console.log(
      `Fetching fixtures for ${competitionCode} from ${dateFrom} to ${dateTo} (${
        showFutureFixtures ? "future" : "past"
      })`
    );

    try {
      const res = await fetch(
        `/api/fixtures/${competitionCode}?dateFrom=${dateFrom}&dateTo=${dateTo}&direction=${
          showFutureFixtures ? "future" : "past"
        }`
      );

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("429 Rate limit exceeded");
        }
        console.error(
          `Failed to fetch fixtures for ${competitionCode}: ${res.status}`
        );
        return [];
      }

      const data = await res.json();
      if (data.error) {
        console.error(`API error for ${competitionCode}:`, data.error);
        return [];
      }

      const matches = (data.matches || []).map((match) => ({
        ...match,
        competitionCode,
      }));

      updateCache(cacheKey, matches);
      return matches;
    } catch (error) {
      console.error(`Error fetching fixtures for ${competitionCode}:`, error);
      throw error;
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitialFixtures = async () => {
      setLoading(true);
      setFixtures([]);
      setHasReachedEnd(false);

      try {
        const initialWindow = {
          start: 7,
          end: 28,
        };
        setDateWindow(initialWindow);

        const initialCodes = selectedCompetitions.map(
          (l) => COMPETITIONS[l].code
        );

        console.log(
          `Loading initial fixtures for ${initialCodes.join(", ")} (${
            showFutureFixtures ? "future" : "past"
          })`
        );

        const matches = await Promise.all(
          initialCodes.map((competitionCode) =>
            fetchFixturesForCompetition(competitionCode, initialWindow)
          )
        );

        const allMatches = matches.flat();
        console.log(`Loaded ${allMatches.length} total fixtures`);

        if (allMatches.length === 0) {
          console.log("No fixtures found in initial load");
          setHasReachedEnd(true);
        }

        setFixtures(sortFixtures(allMatches, showFutureFixtures));
      } catch (error) {
        console.error("Failed to fetch fixtures:", error);
        if (error.message?.includes("429")) {
          alert("Rate limit exceeded. Please try again in a minute.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialFixtures();
  }, [showFutureFixtures]);

  const handleCompetitionChange = async (event) => {
    const competition = event.target.name;
    const competitionCode = COMPETITIONS[competition].code;

    setLoading(true);
    try {
      if (selectedCompetitions.includes(competition)) {
        // Remove competition
        setSelectedCompetitions((prev) =>
          prev.filter((l) => l !== competition)
        );
        setFixtures((prev) =>
          prev.filter((fixture) => fixture.competitionCode !== competitionCode)
        );
      } else {
        // Add competition
        setSelectedCompetitions((prev) => [...prev, competition]);
        const newMatches = await fetchFixturesForCompetition(competitionCode);
        setFixtures((prevFixtures) =>
          sortFixtures([...prevFixtures, ...newMatches], showFutureFixtures)
        );
      }
    } catch (error) {
      console.error("Failed to update fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const INCREMENT_DAYS = 14; // Use same increment for both directions
      const newWindow = {
        start: dateWindow.start + (showFutureFixtures ? 0 : INCREMENT_DAYS),
        end: dateWindow.end + (showFutureFixtures ? INCREMENT_DAYS : 0),
      };

      console.log(`[Load More] Starting load more with window:`, newWindow);
      let attempts = 3;
      let foundFixtures = false;

      // Get current fixture IDs for comparison
      const existingFixtureIds = new Set(fixtures.map((f) => f.id));
      let newFixturesCount = 0;

      while (attempts > 0 && !foundFixtures) {
        console.log(
          `[Load More] Attempt ${4 - attempts} with window:`,
          newWindow
        );

        const matches = await Promise.all(
          selectedCompetitions.map((competition) =>
            fetchFixturesForCompetition(
              COMPETITIONS[competition].code,
              newWindow
            )
          )
        );

        const newFixtures = matches.flat();
        // Count only fixtures that don't exist in our current set
        const uniqueNewFixtures = newFixtures.filter(
          (fixture) => !existingFixtureIds.has(fixture.id)
        );

        console.log(
          `[Load More] Found ${
            uniqueNewFixtures.length
          } new unique fixtures in attempt ${4 - attempts}`
        );

        if (uniqueNewFixtures.length > 0) {
          foundFixtures = true;
          newFixturesCount += uniqueNewFixtures.length;

          setFixtures((prevFixtures) => {
            const combined = [...prevFixtures, ...newFixtures];
            const unique = Array.from(
              new Map(combined.map((f) => [f.id, f])).values()
            );
            const sorted = sortFixtures(unique, showFutureFixtures);
            console.log(
              `[Load More] Updated fixtures list to ${sorted.length} total fixtures (${newFixturesCount} new in this window)`
            );
            return sorted;
          });
          setDateWindow(newWindow);
          console.log(
            `[Load More] Success: loaded ${
              uniqueNewFixtures.length
            } new fixtures for window ${
              showFutureFixtures ? newWindow.end : newWindow.start
            } days ${showFutureFixtures ? "ahead" : "back"}`
          );
        } else {
          // If no new fixtures found, increase window and try again
          console.log(
            `[Load More] No new fixtures found, increasing window size`
          );
          newWindow.start += showFutureFixtures ? 0 : INCREMENT_DAYS;
          newWindow.end += showFutureFixtures ? INCREMENT_DAYS : 0;
          attempts--;
        }
      }

      // Check if we found any new fixtures in this entire window (across all attempts)
      if (newFixturesCount === 0) {
        console.log(
          "[Load More] No new fixtures found in entire window after all attempts, marking as end"
        );
        setHasReachedEnd(true);
      } else {
        console.log(
          `[Load More] Found ${newFixturesCount} new fixtures in this window`
        );
      }
    } catch (error) {
      console.error("[Load More] Error:", error);
      if (error.message?.includes("429")) {
        alert("Rate limit exceeded. Please try again in a minute.");
      } else {
        alert("Failed to load more fixtures. Please try again.");
      }
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
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
                          onChange={handleCompetitionChange}
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
                    <InputLabel htmlFor="hide-scores">
                      Hide all scores
                    </InputLabel>
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
                    <InputLabel htmlFor="show-scores">
                      Show all scores
                    </InputLabel>
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
                    // Set now to start of day for future comparison (to include today's games in future list)
                    // now.setHours(0, 0, 0, 0);
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
                  {/* {index === Math.floor(array.length / 2) && ( */}
                  {index === 1 && (
                    <Interstitial
                      linkUrl="https://www.dannywhite.net/"
                      linkText="Reach out"
                    >
                      <p>
                        Attie is lovingly crafted by one-man-band,{" "}
                        <Link
                          href="https://www.dannywhite.net/"
                          target="_blank"
                        >
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
                      End of fixtures list
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
    </>
  );
}
