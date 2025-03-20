import { useState, useCallback, useEffect } from 'react';
import { COMPETITIONS } from "@/constants/competitions";
import { DEFAULT_WINDOWS } from '@/utils/config/windows';
import { fixturesCache, CACHE_CONFIG } from '@/utils/cache';
import { sortFixtures } from '@/utils/dates';
import { adaptFixture } from '@/utils/adapters';

const buildApiUrl = (apiConfig, params) => {
    const { baseUrl } = apiConfig;
    const queryParams = new URLSearchParams();

    // Add common params
    if (params.dateFrom) queryParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.set('dateTo', params.dateTo);
    if (params.direction) queryParams.set('direction', params.direction);

    // Add pagination params based on sport
    if (params.cursor) queryParams.set('cursor', params.cursor);
    if (params.page) queryParams.set('page', params.page);

    const url = `${baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('[API URL]', url);
    return url;
};

export function useFixtures() {
    const [showFutureFixtures, setShowFutureFixtures] = useState(false);
    const [selectedSport, setSelectedSport] = useState("americanFootball");
    const [selectedCompetitions, setSelectedCompetitions] = useState([
        "nfl",
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
            const apiConfig = getApiConfig(selectedSport, competitionCode);
            const response = await fetch(
                buildApiUrl(apiConfig, {
                    dateFrom,
                    dateTo,
                    direction: showFutureFixtures ? "future" : "past",
                    cursor,
                    page: currentPage
                })
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Use the adapter pattern to standardize the data
            const matches = data.matches.map(match =>
                adaptFixture(match, selectedSport)
            );

            // Handle pagination metadata consistently
            // handlePaginationMeta(data.meta); TODO: Re-enable pagination later

            fixturesCache.set(cacheKey, matches);
            return matches;
        } catch (error) {
            console.error(`[Fetch] Error:`, error);
            throw error;
        }
    }, [dateWindow, showFutureFixtures, selectedSport, currentPage]);

    // Helper to get API configuration for each sport/competition
    const getApiConfig = (sport, competitionCode) => {
        const configs = {
            football: {
                baseUrl: `/api/football/${competitionCode}`,
                paginationType: 'page',
            },
            basketball: {
                baseUrl: `/api/basketball/${competitionCode}`,
                paginationType: 'cursor',
            },
            baseball: {
                baseUrl: `/api/baseball/${competitionCode}`,
                paginationType: 'cursor',
            },
            americanFootball: {
                baseUrl: `/api/american-football/${competitionCode}`,
                paginationType: 'cursor',
            },
        };

        return configs[sport] || configs.football;
    };

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

                // Get new matches
                const newMatches = await fetchFixturesForCompetition(competitionCode);

                // Merge with existing fixtures, ensuring uniqueness by ID
                setFixtures((prevFixtures) => {
                    const combined = [...prevFixtures, ...newMatches];
                    const unique = Array.from(
                        new Map(combined.map((fixture) => [fixture.id, fixture])).values()
                    );
                    console.log(
                        `[Competition Change] Merging fixtures:`,
                        `\n  Previous count: ${prevFixtures.length}`,
                        `\n  New matches: ${newMatches.length}`,
                        `\n  Combined unique: ${unique.length}`
                    );
                    return sortFixtures(unique, showFutureFixtures);
                });
            }
        } catch (error) {
            console.error("[Competition Change] Error:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchFixturesForCompetition, selectedCompetitions, showFutureFixtures]);

    // const handleLoadMore = useCallback(async () => {
    //     if (selectedSport === 'basketball' && !nextCursor) {
    //         console.log('[Load More] No more pages available');
    //         setHasReachedEnd(true);
    //         return;
    //     }

    //     setLoadingMore(true);
    //     setHasRateLimitError(false);

    //     try {
    //         if (selectedSport === 'basketball') {
    //             const matches = await Promise.all(
    //                 selectedCompetitions.map((competition) =>
    //                     fetchFixturesForCompetition(
    //                         COMPETITIONS[competition].code,
    //                         null,
    //                         nextCursor
    //                     )
    //                 )
    //             );

    //             const newFixtures = matches.flat();

    //             setFixtures((prevFixtures) => {
    //                 const combined = [...prevFixtures, ...newFixtures];
    //                 const unique = Array.from(
    //                     new Map(combined.map((f) => [f.id, f])).values()
    //                 );
    //                 return sortFixtures(unique, showFutureFixtures);
    //             });
    //         } else {
    //             // ... existing football load more logic ...
    //         }
    //     } catch (error) {
    //         console.error("[Load More] Error:", error);
    //         if (error.message !== "RATE_LIMIT_EXCEEDED") {
    //             alert("Failed to load more fixtures. Please try again.");
    //         }
    //     } finally {
    //         setLoadingMore(false);
    //     }
    // }, [fetchFixturesForCompetition, selectedSport, nextCursor, selectedCompetitions, showFutureFixtures]);
    // const handleLoadMore = console.log("Load more coming soon")

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
        // handleLoadMore,
        loadInitialFixtures,
    };
} 
