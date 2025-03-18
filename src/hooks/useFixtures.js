import { useState, useCallback } from 'react';
import { COMPETITIONS } from "@/constants/competitions";
import { DEFAULT_WINDOWS } from '@/utils/config/windows';
import { fixturesCache, CACHE_CONFIG } from '@/utils/cache';
import { sortFixtures } from '@/utils/dates';

export function useFixtures() {
    const [showFutureFixtures, setShowFutureFixtures] = useState(false);
    const [selectedSport, setSelectedSport] = useState("football");
    const [selectedCompetitions, setSelectedCompetitions] = useState([
        "premier-league",
        // "champions-league",
    ]);
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasReachedEnd, setHasReachedEnd] = useState(false);
    const [hasRateLimitError, setHasRateLimitError] = useState(false);
    const [dateWindow, setDateWindow] = useState(() => ({
        start: DEFAULT_WINDOWS.INITIAL.PAST.start,
        end: showFutureFixtures
            ? DEFAULT_WINDOWS.INITIAL.FUTURE.end
            : DEFAULT_WINDOWS.INITIAL.PAST.end,
    }));

    const fetchFixturesForCompetition = useCallback(async (
        competitionCode,
        customDateWindow,
        maxAttempts = DEFAULT_WINDOWS.MAX_ATTEMPTS
    ) => {
        const now = Date.now();
        const cacheKey = `${competitionCode}-${customDateWindow?.start || dateWindow.start
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
            startDate.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0);
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
                `/api/fixtures/${competitionCode}?dateFrom=${dateFrom}&dateTo=${dateTo}&direction=${showFutureFixtures ? "future" : "past"
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
    }, [dateWindow, showFutureFixtures]);

    const loadInitialFixtures = useCallback(async () => {
        setLoading(true);
        setFixtures([]);
        setHasReachedEnd(false);
        setHasRateLimitError(false);

        try {
            const initialWindow = showFutureFixtures
                ? DEFAULT_WINDOWS.INITIAL.FUTURE
                : DEFAULT_WINDOWS.INITIAL.PAST;

            setDateWindow(initialWindow);

            const initialCodes = selectedCompetitions.map(
                (l) => COMPETITIONS[l].code
            );

            console.log(
                `[Initial Load] Getting ${showFutureFixtures ? "future" : "past"} fixtures`,
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
    }, [fetchFixturesForCompetition, selectedCompetitions, showFutureFixtures]);

    const handleCompetitionChange = useCallback(async (competition) => {
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
            console.error("[Competition Change] Error:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchFixturesForCompetition, selectedCompetitions, showFutureFixtures]);

    const handleLoadMore = useCallback(async () => {
        setLoadingMore(true);
        setHasRateLimitError(false);

        try {
            const newWindow = {
                start:
                    dateWindow.start +
                    (showFutureFixtures ? 0 : DEFAULT_WINDOWS.INCREMENT.DAYS),
                end:
                    dateWindow.end +
                    (showFutureFixtures ? DEFAULT_WINDOWS.INCREMENT.DAYS : 0),
            };

            console.log(`[Load More] Starting with window:`, newWindow);
            let attempts = DEFAULT_WINDOWS.MAX_ATTEMPTS;
            let foundFixtures = false;

            // Get current fixture IDs for comparison
            const existingFixtureIds = new Set(fixtures.map((f) => f.id));
            let newFixturesCount = 0;

            while (attempts > 0 && !foundFixtures) {
                console.log(
                    `[Load More] Attempt ${DEFAULT_WINDOWS.MAX_ATTEMPTS - attempts + 1
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
                                `\n  Window: ${showFutureFixtures ? newWindow.end : newWindow.start
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
                            : DEFAULT_WINDOWS.INCREMENT.DAYS;
                        newWindow.end += showFutureFixtures
                            ? DEFAULT_WINDOWS.INCREMENT.DAYS
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

            if (newFixturesCount === 0 && !hasRateLimitError) {
                console.log(
                    "[Load More] No new fixtures found after all attempts, marking as end"
                );
                setHasReachedEnd(true);
            }
        } catch (error) {
            console.error("[Load More] Error:", error);
            if (error.message !== "RATE_LIMIT_EXCEEDED") {
                alert("Failed to load more fixtures. Please try again.");
            }
        } finally {
            setLoadingMore(false);
        }
    }, [fetchFixturesForCompetition, dateWindow, fixtures, selectedCompetitions, showFutureFixtures, hasRateLimitError]);

    return {
        // State
        fixtures,
        loading,
        loadingMore,
        hasReachedEnd,
        hasRateLimitError,
        showFutureFixtures,
        selectedSport,
        selectedCompetitions,

        // Actions
        setShowFutureFixtures,
        setSelectedSport,
        handleCompetitionChange,
        handleLoadMore,
        loadInitialFixtures,
    };
} 
