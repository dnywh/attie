import { useState, useCallback, useEffect } from 'react';
import { COMPETITIONS } from "@/constants/competitions";
import { DEFAULT_WINDOWS } from '@/utils/config/windows';
import { sortFixtures } from '@/utils/dates';
import { adaptFixture } from '@/utils/adapters';
import { DEFAULTS } from "@/constants/defaults";
import { ADAPTER_BASE_PATHS } from '@/utils/adapters';

const buildApiUrl = (competition, params) => {
    const adapterType = competition.api.adapter;
    if (!adapterType) {
        throw new Error(`No adapter specified for competition ${competition.name}`);
    }

    // Get the base path for this adapter type
    const basePath = ADAPTER_BASE_PATHS[adapterType];
    if (!basePath) {
        throw new Error(`No base path found for adapter ${adapterType}`);
    }

    const queryParams = new URLSearchParams();

    // Add common params
    if (params.dateFrom) queryParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.set('dateTo', params.dateTo);
    if (params.direction) queryParams.set('direction', params.direction);

    // Add various identifiers based on adapter type
    if (adapterType === 'football-data') {
        // football-data expects a competition code in their format
        if (!competition.api.code) {
            throw new Error(`Football-data adapter requires a competition code for ${competition.name}`);
        }
        queryParams.set('competition', competition.api.code);
    } else if (adapterType === 'espn') {
        // espn expects a sport and league in their format
        queryParams.set('sport', competition.api.sport);
        queryParams.set('league', competition.api.league);
        competition.api.groups && queryParams.set('groups', competition.api.groups);
        competition.api.limit && queryParams.set('limit', competition.api.limit);
    }
    // else {
    //     // For other adapters, use the competition key as identifier
    //     queryParams.set('competition', competition.name.toLowerCase());
    // }

    // Add pagination params
    if (params.cursor) queryParams.set('cursor', params.cursor);
    if (params.page) queryParams.set('page', params.page);

    const url = `${basePath}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return url;
};

export function useFixtures(initialParams) {
    // Use provided params (i.e. searchParams or initialParams set by a [competition] page), or fallback to defaults
    const [showFutureFixtures, setShowFutureFixtures] = useState(
        initialParams?.direction ?? DEFAULTS.DIRECTION
    );
    const [selectedSport, setSelectedSport] = useState(
        initialParams?.sport ?? DEFAULTS.SPORT
    );
    const [selectedCompetitions, setSelectedCompetitions] = useState(
        initialParams?.competitions ?? DEFAULTS.COMPETITIONS
    );
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

    // Sport change handler
    const handleSportChange = useCallback((newSport) => {
        // Get default competition for the new sport
        const defaultCompetition = Object.keys(COMPETITIONS).find(
            (key) => COMPETITIONS[key].sport === newSport && COMPETITIONS[key].defaultForSport
        );

        if (!defaultCompetition) {
            console.error(`[Sport Change] No default competition found for ${newSport}`);
            return;
        }

        setSelectedSport(newSport);
        setSelectedCompetitions([defaultCompetition]);
        setFixtures([]);
        setNextCursor(null);
        setCurrentPage(1);
        setHasReachedEnd(false);
    }, []);

    // Load initial fixtures
    useEffect(() => {
        // Only load fixtures if we have selected competitions
        if (selectedCompetitions.length > 0) {
            loadInitialFixtures();
        }
    }, [selectedSport, selectedCompetitions, showFutureFixtures]);

    const fetchFixturesForCompetition = useCallback(async (competitionKey, customDateWindow, cursor = null) => {
        const competition = COMPETITIONS[competitionKey];
        if (!competition) {
            throw new Error(`Competition ${competitionKey} not found`);
        }

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

        try {
            const response = await fetch(
                buildApiUrl(competition, {
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

            // Handle different API response structures (events for ESPN, matches for others)
            const fixtureArray = data.matches || data.events || [];

            // Handle error if array is not in above fixtures format
            if (!Array.isArray(fixtureArray)) {
                console.error('Expected array of fixtures, got:', fixtureArray);
                return [];
            }

            // Use the adapter pattern to standardize the data
            const matches = fixtureArray.map(match => {
                return adaptFixture(match, competitionKey, selectedSport);
            });

            return matches;
        } catch (error) {
            console.error(`[Fetch] Error:`, error);
            throw error;
        }
    }, [dateWindow, showFutureFixtures, currentPage, selectedSport]);

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

            const matches = await Promise.all(
                selectedCompetitions.map((competitionKey) =>
                    fetchFixturesForCompetition(competitionKey, initialWindow)
                )
            );

            const allMatches = matches.flat();

            // Handle case where no fixtures are found in range
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

    const handleCompetitionChange = useCallback(async (competitionKey) => {
        setLoading(true);
        try {
            if (selectedCompetitions.includes(competitionKey)) {
                // Update both states in a single batch to avoid race conditions
                const newSelectedCompetitions = selectedCompetitions.filter(l => l !== competitionKey);
                setSelectedCompetitions(newSelectedCompetitions);

                // Only keep fixtures for the remaining competitions
                setFixtures(prevFixtures =>
                    prevFixtures.filter(fixture =>
                        newSelectedCompetitions.includes(fixture.competition.id)
                    )
                );
            } else {
                // Add competition
                setSelectedCompetitions((prev) => [...prev, competitionKey]);

                // Get new matches
                const newMatches = await fetchFixturesForCompetition(competitionKey);

                // Merge with existing fixtures, ensuring uniqueness by ID
                setFixtures((prevFixtures) => {
                    const combined = [...prevFixtures, ...newMatches];
                    const unique = Array.from(
                        new Map(combined.map((fixture) => [fixture.id, fixture])).values()
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
        setSelectedCompetitions,
        handleCompetitionChange,
        // handleLoadMore,
        loadInitialFixtures,
    };
} 
