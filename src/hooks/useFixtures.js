import { useState, useCallback, useEffect } from 'react';
import { COMPETITIONS } from "@/constants/competitions";
import { DEFAULT_WINDOWS } from '@/utils/config/windows';
import { fixturesCache, CACHE_CONFIG } from '@/utils/cache';
import { sortFixtures } from '@/utils/dates';
import { adaptBasketballFixture } from '@/utils/adapters/basketballAdapter';

export function useFixtures() {
    const [showFutureFixtures, setShowFutureFixtures] = useState(false);
    const [selectedSport, setSelectedSport] = useState("football");
    const [selectedCompetitions, setSelectedCompetitions] = useState([
        "premier-league",
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

    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Add new state for cursor
    const [nextCursor, setNextCursor] = useState(null);

    // Modified sport change handler
    const handleSportChange = useCallback((newSport) => {
        console.log(`[Sport Change] Switching to ${newSport}`);

        // Get default competition for the new sport
        const defaultCompetition = Object.keys(COMPETITIONS).find(
            (key) => COMPETITIONS[key].sport === newSport && COMPETITIONS[key].tier === 'free'
        );

        if (!defaultCompetition) {
            console.error(`[Sport Change] No default competition found for ${newSport}`);
            return;
        }

        setSelectedSport(newSport);
        setSelectedCompetitions([defaultCompetition]);
        fixturesCache.clear();
        setFixtures([]);
        setNextCursor(null);
        setCurrentPage(1);
        setHasReachedEnd(false);
    }, []);

    // Replace direct setSelectedSport usage with handleSportChange
    useEffect(() => {
        console.log("[Sport Change] Clearing fixtures and cache");
        loadInitialFixtures();
    }, [selectedSport]);

    const fetchFixturesForCompetition = useCallback(async (
        competitionCode,
        customDateWindow,
        cursor = null
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
            `\n Sport: ${selectedSport}`,
            `\n  Competition: ${competitionCode}`,
            `\n  Date range: ${dateFrom} to ${dateTo}`
        );

        try {
            // First check if it's basketball since that's a special case
            if (selectedSport === 'basketball') {
                const response = await fetch(
                    `/api/basketball/nba?dateFrom=${dateFrom}&dateTo=${dateTo}&direction=${showFutureFixtures ? "future" : "past"}${cursor ? `&cursor=${cursor}` : ''}`
                );

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();

                // Store next cursor for subsequent requests
                setNextCursor(data.meta.next_cursor);
                setHasReachedEnd(!data.meta.has_more);

                // Transform the basketball data
                const matches = data.matches.map(game => adaptBasketballFixture(game));

                console.log(
                    `[Fetch] Found ${matches.length} NBA games`,
                    `\n  Next cursor: ${data.meta.next_cursor || 'None'}`,
                    `\n  Has more: ${data.meta.has_more}`
                );

                fixturesCache.set(cacheKey, matches);
                return matches;
            }

            // Handle football requests
            const response = await fetch(
                `/api/football/${competitionCode}?dateFrom=${dateFrom}&dateTo=${dateTo}&direction=${showFutureFixtures ? "future" : "past"}&page=${currentPage}`
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const matches = (data.matches || []).map((match) => ({
                ...match,
                competitionCode,
            }));

            console.log(
                `[Fetch] Found ${matches.length} football matches for ${competitionCode}`,
                `\n  Window: ${windowStart}-${windowEnd} days`,
                `\n  Direction: ${showFutureFixtures ? "future" : "past"}`
            );

            // Update hasReachedEnd based on pagination
            setHasReachedEnd(data.meta.current_page >= data.meta.total_pages);

            fixturesCache.set(cacheKey, matches);
            return matches;
        } catch (error) {
            console.error(
                `[Fetch] Error fetching fixtures for ${competitionCode}:`,
                error
            );
            throw error;
        }
    }, [dateWindow, showFutureFixtures, selectedSport, currentPage, nextCursor]);

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
        if (selectedSport === 'basketball' && !nextCursor) {
            console.log('[Load More] No more pages available');
            setHasReachedEnd(true);
            return;
        }

        setLoadingMore(true);
        setHasRateLimitError(false);

        try {
            if (selectedSport === 'basketball') {
                const matches = await Promise.all(
                    selectedCompetitions.map((competition) =>
                        fetchFixturesForCompetition(
                            COMPETITIONS[competition].code,
                            null,
                            nextCursor
                        )
                    )
                );

                const newFixtures = matches.flat();

                setFixtures((prevFixtures) => {
                    const combined = [...prevFixtures, ...newFixtures];
                    const unique = Array.from(
                        new Map(combined.map((f) => [f.id, f])).values()
                    );
                    return sortFixtures(unique, showFutureFixtures);
                });
            } else {
                // ... existing football load more logic ...
            }
        } catch (error) {
            console.error("[Load More] Error:", error);
            if (error.message !== "RATE_LIMIT_EXCEEDED") {
                alert("Failed to load more fixtures. Please try again.");
            }
        } finally {
            setLoadingMore(false);
        }
    }, [fetchFixturesForCompetition, selectedSport, nextCursor, selectedCompetitions, showFutureFixtures]);

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
        setSelectedSport: handleSportChange,
        handleCompetitionChange,
        handleLoadMore,
        loadInitialFixtures,
    };
} 
