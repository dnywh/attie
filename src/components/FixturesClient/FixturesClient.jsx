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

// Constants for date windows and cache management
const CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  KEY: "fixturesDevCache",
  DIRECTION_KEY: "fixturesDirection",
};

// Window configuration for different sports/APIs
const WINDOW_CONFIG = {
  FOOTBALL: {
    INITIAL: {
      PAST: { start: 7, end: 7 },
      FUTURE: { start: 0, end: 28 },
    },
    INCREMENT: {
      DAYS: 14, // Days to increment when loading more
    },
    MAX_ATTEMPTS: 3, // Maximum attempts to find new fixtures when loading more
  },
  // Add other sports here with their own window configurations
};

// Use football config as default for now
const DATE_WINDOWS = WINDOW_CONFIG.FOOTBALL;

// Cache management
class FixturesCache {
  constructor() {
    this.cache = new Map();
    this.isDev = process.env.NODE_ENV === "development";
    this.initializeCache();
  }

  initializeCache() {
    if (this.isDev && typeof window !== "undefined") {
      try {
        const saved = JSON.parse(
          localStorage.getItem(CACHE_CONFIG.KEY) || "[]"
        );
        saved.forEach(([key, value]) => this.cache.set(key, value));
        console.log("[Cache] Initialized with", this.cache.size, "entries");
      } catch (e) {
        console.warn("[Cache] Failed to restore:", e);
      }
    }
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp < CACHE_CONFIG.DURATION) {
      console.log(`[Cache] Hit for ${key}`);
      return cached.data;
    }

    console.log(`[Cache] Expired for ${key}`);
    this.cache.delete(key);
    return null;
  }

  set(key, data) {
    this.cache.set(key, {
      timestamp: Date.now(),
      data,
    });

    if (this.isDev && typeof window !== "undefined") {
      try {
        localStorage.setItem(CACHE_CONFIG.KEY, JSON.stringify([...this.cache]));
        console.log(`[Cache] Updated for ${key}`);
      } catch (e) {
        console.warn("[Cache] Failed to save:", e);
      }
    }
  }

  clear() {
    console.log("[Cache] Clearing");
    this.cache.clear();
    if (this.isDev && typeof window !== "undefined") {
      localStorage.removeItem(CACHE_CONFIG.KEY);
    }
  }
}

// Initialize cache singleton
const fixturesCache = new FixturesCache();

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
  const [hasRateLimitError, setHasRateLimitError] = useState(false);
  const [dateWindow, setDateWindow] = useState(() => ({
    start: DATE_WINDOWS.INITIAL.PAST.start,
    end: showFutureFixtures
      ? DATE_WINDOWS.INITIAL.FUTURE.end
      : DATE_WINDOWS.INITIAL.PAST.end,
  }));

  const fetchFixturesForCompetition = async (
    competitionCode,
    customDateWindow,
    maxAttempts = DATE_WINDOWS.MAX_ATTEMPTS
  ) => {
    const now = Date.now();
    const cacheKey = `${competitionCode}-${
      customDateWindow?.start || dateWindow.start
    }-${customDateWindow?.end || dateWindow.end}-${showFutureFixtures}`;

    // Clear cache when switching directions
    const cachedDirection = fixturesCache.get(CACHE_CONFIG.DIRECTION_KEY);
    if (showFutureFixtures !== cachedDirection) {
      console.log("[Fetch] Direction changed, clearing cache");
      fixturesCache.clear();
      fixturesCache.set(CACHE_CONFIG.DIRECTION_KEY, showFutureFixtures);
    }

    // Check cache first
    const cached = fixturesCache.get(cacheKey);
    if (cached) return cached;

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
      );
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
      `[Fetch] Getting ${showFutureFixtures ? "future" : "past"} fixtures`,
      `\n  Competition: ${competitionCode}`,
      `\n  Date range: ${dateFrom} to ${dateTo}`
    );

    try {
      const res = await fetch(
        `/api/fixtures/${competitionCode}?dateFrom=${dateFrom}&dateTo=${dateTo}&direction=${
          showFutureFixtures ? "future" : "past"
        }`
      );

      if (!res.ok) {
        const errorData = await res.json();

        if (res.status === 429) {
          console.error(`[Fetch] Rate limit exceeded for ${competitionCode}`);
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        console.error(
          `[Fetch] Failed to fetch fixtures for ${competitionCode}: ${res.status}`,
          errorData
        );
        throw new Error(errorData.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        console.error(`[Fetch] API error for ${competitionCode}:`, data.error);
        throw new Error(data.error);
      }

      const matches = (data.matches || []).map((match) => ({
        ...match,
        competitionCode,
      }));

      console.log(
        `[Fetch] Found ${matches.length} matches for ${competitionCode}`,
        `\n  Window: ${windowStart}-${windowEnd} days`,
        `\n  Direction: ${showFutureFixtures ? "future" : "past"}`
      );

      fixturesCache.set(cacheKey, matches);
      return matches;
    } catch (error) {
      console.error(
        `[Fetch] Error fetching fixtures for ${competitionCode}:`,
        error
      );
      throw error;
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitialFixtures = async () => {
      setLoading(true);
      setFixtures([]);
      setHasReachedEnd(false);
      setHasRateLimitError(false);

      try {
        const initialWindow = showFutureFixtures
          ? DATE_WINDOWS.INITIAL.FUTURE
          : DATE_WINDOWS.INITIAL.PAST;

        setDateWindow(initialWindow);

        const initialCodes = selectedCompetitions.map(
          (l) => COMPETITIONS[l].code
        );

        console.log(
          `[Initial Load] Getting ${
            showFutureFixtures ? "future" : "past"
          } fixtures`,
          `\n  Competitions: ${initialCodes.join(", ")}`,
          `\n  Window: start=${initialWindow.start}, end=${initialWindow.end}`
        );

        const matches = await Promise.all(
          initialCodes.map((competitionCode) =>
            fetchFixturesForCompetition(competitionCode, initialWindow)
          )
        );

        const allMatches = matches.flat();
        console.log(`[Initial Load] Found ${allMatches.length} total fixtures`);

        if (allMatches.length === 0) {
          console.log("[Initial Load] No fixtures found");
          setHasReachedEnd(true);
        }

        setFixtures(sortFixtures(allMatches, showFutureFixtures));
      } catch (error) {
        console.error("[Initial Load] Error:", error);
        if (error.message === "RATE_LIMIT_EXCEEDED") {
          setHasRateLimitError(true);
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
    setHasRateLimitError(false);

    try {
      const newWindow = {
        start:
          dateWindow.start +
          (showFutureFixtures ? 0 : DATE_WINDOWS.INCREMENT.DAYS),
        end:
          dateWindow.end +
          (showFutureFixtures ? DATE_WINDOWS.INCREMENT.DAYS : 0),
      };

      console.log(`[Load More] Starting with window:`, newWindow);
      let attempts = DATE_WINDOWS.MAX_ATTEMPTS;
      let foundFixtures = false;

      // Get current fixture IDs for comparison
      const existingFixtureIds = new Set(fixtures.map((f) => f.id));
      let newFixturesCount = 0;

      while (attempts > 0 && !foundFixtures) {
        console.log(
          `[Load More] Attempt ${
            DATE_WINDOWS.MAX_ATTEMPTS - attempts + 1
          } with window:`,
          newWindow
        );

        try {
          const matches = await Promise.all(
            selectedCompetitions.map((competition) =>
              fetchFixturesForCompetition(
                COMPETITIONS[competition].code,
                newWindow
              )
            )
          );

          const newFixtures = matches.flat();
          const uniqueNewFixtures = newFixtures.filter(
            (fixture) => !existingFixtureIds.has(fixture.id)
          );

          console.log(
            `[Load More] Found ${
              uniqueNewFixtures.length
            } new unique fixtures in attempt ${
              DATE_WINDOWS.MAX_ATTEMPTS - attempts + 1
            }`
          );

          if (uniqueNewFixtures.length > 0) {
            foundFixtures = true;
            newFixturesCount += uniqueNewFixtures.length;

            setFixtures((prevFixtures) => {
              const combined = [...prevFixtures, ...uniqueNewFixtures];
              const unique = Array.from(
                new Map(combined.map((f) => [f.id, f])).values()
              );
              const sorted = sortFixtures(unique, showFutureFixtures);

              console.log(
                `[Load More] Updated fixtures list:`,
                `\n  Total: ${sorted.length}`,
                `\n  New: ${newFixturesCount}`,
                `\n  Window: ${
                  showFutureFixtures ? newWindow.end : newWindow.start
                } days ${showFutureFixtures ? "ahead" : "back"}`
              );

              return sorted;
            });

            setDateWindow(newWindow);
          } else {
            console.log(
              `[Load More] No new fixtures found, increasing window size`
            );
            newWindow.start += showFutureFixtures
              ? 0
              : DATE_WINDOWS.INCREMENT.DAYS;
            newWindow.end += showFutureFixtures
              ? DATE_WINDOWS.INCREMENT.DAYS
              : 0;
            attempts--;
          }
        } catch (error) {
          if (error.message === "RATE_LIMIT_EXCEEDED") {
            console.log("[Load More] Rate limit hit, stopping attempts");
            setHasRateLimitError(true);
            break;
          }
          throw error;
        }
      }

      // Check if we found any new fixtures across all attempts
      if (newFixturesCount === 0 && !hasRateLimitError) {
        console.log(
          "[Load More] No new fixtures found after all attempts, marking as end"
        );
        setHasReachedEnd(true);
      } else {
        console.log(
          `[Load More] Found ${newFixturesCount} new fixtures in this window`
        );
      }
    } catch (error) {
      console.error("[Load More] Error:", error);
      if (error.message !== "RATE_LIMIT_EXCEEDED") {
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
    </>
  );
}
