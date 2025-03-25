import { useState, useCallback, useEffect, useRef } from 'react';
import { COMPETITIONS } from "@/constants/competitions";
import { DEFAULT_WINDOWS } from '@/utils/config/windows';
import { sortFixtures } from '@/utils/dates';
import { adaptFixture } from '@/utils/adapters';
import { DEFAULTS } from "@/constants/defaults";
import { ADAPTER_BASE_PATHS } from '@/utils/adapters';

// Helper function to safely get stored preferences (client-side only)
const getStoredPreferences = () => {
    // Just use standard defaults if this is run on server
    if (typeof window === 'undefined') {
        return {
            sport: DEFAULTS.SPORT,
            competitions: DEFAULTS.COMPETITIONS,
            direction: DEFAULTS.DIRECTION,
            sound: DEFAULTS.SOUND,
        };
    }
    // Continue if on client
    const storedSport = localStorage.getItem("attie.sport");
    const storedCompetitions = localStorage.getItem(`attie.competitions.${storedSport}`);
    const storedDirection = localStorage.getItem("attie.direction")
    const storedSound = localStorage.getItem("attie.sound")

    return {
        sport: storedSport || DEFAULTS.SPORT,
        competitions: storedCompetitions ? JSON.parse(storedCompetitions) : DEFAULTS.COMPETITIONS,
        direction: storedDirection || DEFAULTS.DIRECTION,
        sound: storedSound || DEFAULTS.SOUND
    };
};

// Initialize localStorage with defaults if empty
const initializeStorage = () => {
    // Ignore if this is run on server
    if (typeof window === 'undefined') return;

    // Continue if on client
    // Set sport and subsequent competitions
    if (!localStorage.getItem("attie.sport")) {
        localStorage.setItem("attie.sport", DEFAULTS.SPORT);
        localStorage.setItem(`attie.competitions.${DEFAULTS.SPORT}`, JSON.stringify(DEFAULTS.COMPETITIONS));
    }
    // Set other preferences
    if (!localStorage.getItem("attie.direction")) {
        localStorage.setItem("attie.direction", DEFAULTS.DIRECTION);
    }
    if (!localStorage.getItem("attie.sound")) {
        localStorage.setItem("attie.sound", DEFAULTS.SOUND);
    }
};




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
    // console.log(getStoredPreferences().sport)
    // // Get stored preferences
    // const storedPrefs = {
    //     sport: DEFAULTS.SPORT,
    //     competitions: DEFAULTS.COMPETITIONS,
    //     direction: DEFAULTS.DIRECTION
    // }
    const [useSoundEffects, setUseSoundEffects] = useState(getStoredPreferences().sound);

    // Use provided params (i.e. searchParams or initialParams set by a [competition] page), or fallback to defaults
    const [showFutureFixtures, setShowFutureFixtures] = useState(
        initialParams?.direction ?? getStoredPreferences().direction
    );
    const [selectedSport, setSelectedSport] = useState(
        initialParams?.sport ?? getStoredPreferences().sport
    );
    const [selectedCompetitions, setSelectedCompetitions] = useState(
        initialParams?.competitions ?? getStoredPreferences().competitions
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

    // Ref for load attempts
    const loadAttemptsRef = useRef(0);

    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Add new state for cursor
    const [nextCursor, setNextCursor] = useState(null);

    // Sport change handler
    const handleSportChange = useCallback((newSport) => {
        console.log(newSport, selectedSport)
        // Prevent unecessary updates if sport is the same
        // if (newSport === selectedSport) return;

        // Check if there are any previously stored competitions for this sport
        const storedCompetitionsForSport = localStorage.getItem(`attie.competitions.${newSport}`);
        let newCompetitionsForSport;

        if (storedCompetitionsForSport) {
            // Use previously stored competitions if they exist
            newCompetitionsForSport = JSON.parse(storedCompetitionsForSport);
        } else {
            // Otherwise, use the default competition for this sport
            const defaultCompetitionForSport = Object.keys(COMPETITIONS).find(
                (key) => COMPETITIONS[key].sport === newSport && COMPETITIONS[key].defaultForSport
            );

            if (!defaultCompetitionForSport) {
                console.error(`[Sport Change] No default competition found for ${newSport}`);
                return;
            }
            newCompetitionsForSport = [defaultCompetitionForSport]
        }

        // Update sport
        setSelectedSport(newSport);
        localStorage.setItem("attie.sport", newSport);
        // Update competition(s)
        setSelectedCompetitions(newCompetitionsForSport)
        if (!storedCompetitionsForSport) {
            localStorage.setItem(`attie.competitions.${newSport}`, JSON.stringify(newCompetitionsForSport))
        }
        // Reset fixture-related state
        setFixtures([]);
        setNextCursor(null);
        setCurrentPage(1);
        setHasReachedEnd(false);
    }, []);

    // Initialize from localStorage after mount
    useEffect(() => {
        initializeStorage();
    }, []);

    // Load initial fixtures
    useEffect(() => {
        // Only load fixtures if we have selected competitions
        if (selectedCompetitions.length > 0) {
            loadInitialFixtures();
        }
    }, [selectedSport, showFutureFixtures]);

    const fetchFixturesForCompetition = useCallback(async (competitionKey, customDateWindow, cursor = null) => {
        const competition = COMPETITIONS[competitionKey];

        if (!competition) {
            throw new Error(`Competition ${competitionKey} not found`);
        }

        // Calculate date range based on the provided window
        const currentDate = new Date();
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);

        // Always use the custom window if provided, otherwise fallback to state
        const windowStart = customDateWindow.start;
        const windowEnd = customDateWindow.end;

        if (showFutureFixtures) {
            // For future fixtures, start from current date and go forward
            startDate.setHours(0, 0, 0, 0); // Start from beginning of current day
            endDate.setDate(currentDate.getDate() + windowEnd);
            endDate.setHours(23, 59, 59, 999);
        } else {
            // For past fixtures, go backwards from current date
            startDate.setDate(currentDate.getDate() - windowStart);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999); // Include full current day
        }

        const dateFrom = startDate.toISOString().split("T")[0];
        const dateTo = endDate.toISOString().split("T")[0];

        // For ESPN adapter, add one day to the end date since their API is exclusive of the end date
        const adjustedDateTo = competition.api.adapter === 'espn'
            ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            : dateTo;

        // console.log(`[Fetch] Date range for ${competitionKey}:`, {
        //     windowStart,
        //     windowEnd,
        //     dateFrom,
        //     dateTo,
        //     adjustedDateTo,
        //     showFutureFixtures,
        //     startDate: startDate.toISOString(),
        //     endDate: endDate.toISOString()
        // });

        try {
            const response = await fetch(
                buildApiUrl(competition, {
                    dateFrom,
                    dateTo: adjustedDateTo,
                    direction: showFutureFixtures ? "future" : "past",
                    cursor,
                    page: currentPage
                })
            );

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const fixtureArray = data.matches || data.events || [];

            if (!Array.isArray(fixtureArray)) {
                console.error('Expected array of fixtures, got:', fixtureArray);
                return [];
            }

            return fixtureArray.map(match => adaptFixture(match, competitionKey, selectedSport));
        } catch (error) {
            console.error(`[Fetch] Error:`, error);
            throw error;
        }
    }, [showFutureFixtures, currentPage, selectedSport]);

    const handleLoadMore = useCallback(async (currentWindow = dateWindow) => {
        if (loadAttemptsRef.current >= DEFAULT_WINDOWS.MAX_ATTEMPTS) {
            console.log("[Load More] Max attempts reached");
            setHasReachedEnd(true);
            return;
        }

        loadAttemptsRef.current += 1;
        console.log("[Load More] Starting load more with attempts:", loadAttemptsRef.current);

        setLoadingMore(true);

        try {
            const increment = DEFAULT_WINDOWS.INCREMENT.DAYS;
            const newWindow = { ...currentWindow };

            if (showFutureFixtures) {
                // Move the window forward by increment
                newWindow.start = newWindow.end;
                newWindow.end += increment;
            } else {
                // Move the window backward by increment
                newWindow.end = newWindow.start;
                newWindow.start += increment;
            }

            console.log("[Load More] New date window:", newWindow);

            const newMatches = await Promise.all(
                selectedCompetitions.map((competitionKey) =>
                    fetchFixturesForCompetition(competitionKey, newWindow)
                )
            );

            const allNewMatches = newMatches.flat();
            console.log("[Load More] Found new matches:", allNewMatches.length);

            if (allNewMatches.length > 0) {
                setFixtures(prevFixtures => {
                    const combined = [...prevFixtures, ...allNewMatches];
                    const unique = Array.from(
                        new Map(combined.map((fixture) => [fixture.id, fixture])).values()
                    );
                    return sortFixtures(unique, showFutureFixtures);
                });
                setDateWindow(newWindow);
                loadAttemptsRef.current = 0;
            } else {
                await handleLoadMore(newWindow);
            }
        } catch (error) {
            console.error("[Load More] Error:", error);
            if (error.message === "RATE_LIMIT_EXCEEDED") {
                setHasRateLimitError(true);
            }
        } finally {
            setLoadingMore(false);
        }
    }, [dateWindow, showFutureFixtures, selectedCompetitions, fetchFixturesForCompetition]);

    const loadInitialFixtures = useCallback(async () => {
        setLoading(true);
        setFixtures([]);
        setHasReachedEnd(false);
        setHasRateLimitError(false);
        loadAttemptsRef.current = 0;

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

            if (allMatches.length === 0) {
                console.log("[Initial Load] No fixtures found, attempting to load more");
                await handleLoadMore();
            } else {
                setFixtures(sortFixtures(allMatches, showFutureFixtures));
            }
        } catch (error) {
            console.error("[Initial Load] Error:", error);
            if (error.message === "RATE_LIMIT_EXCEEDED") {
                setHasRateLimitError(true);
            }
        } finally {
            setLoading(false);
        }
    }, [fetchFixturesForCompetition, selectedCompetitions, showFutureFixtures, handleLoadMore]);

    const handleCompetitionChange = useCallback(async (competitionKey) => {
        setLoading(true);
        // console.log('[Competition Change] Current competitions:', { selectedCompetitions });
        // console.log(competitionKey, selectedCompetitions)

        try {
            let newSelectedCompetitions;
            if (selectedCompetitions.includes(competitionKey)) {
                newSelectedCompetitions = selectedCompetitions.filter(l => l !== competitionKey);
                setSelectedCompetitions(newSelectedCompetitions);
                // console.log({ newSelectedCompetitions })

                setFixtures(prevFixtures => {
                    const filtered = prevFixtures.filter(fixture => {
                        // Get the competition key from the competition name
                        const fixtureCompetitionKey = Object.entries(COMPETITIONS).find(
                            ([_, comp]) => comp.name === fixture.competition.name
                        )?.[0];
                        return newSelectedCompetitions.includes(fixtureCompetitionKey);
                    });
                    return filtered;
                });
            } else {
                // Add competition
                newSelectedCompetitions = [...selectedCompetitions, competitionKey];
                setSelectedCompetitions(newSelectedCompetitions);

                // Only fetch data for the new competition
                const newMatches = await fetchFixturesForCompetition(competitionKey, dateWindow);
                console.log('[Competition Change] New matches fetched:', newMatches.length);

                // Merge with existing fixtures, ensuring uniqueness by ID
                setFixtures(prevFixtures => {
                    const combined = [...prevFixtures, ...newMatches];
                    const unique = Array.from(
                        new Map(combined.map(fixture => [fixture.id, fixture])).values()
                    );
                    return sortFixtures(unique, showFutureFixtures);
                });
            }
            // if (typeof window !== 'undefined') {
            localStorage.setItem(`attie.competitions.${selectedSport}`, JSON.stringify(newSelectedCompetitions));
        } catch (error) {
            console.error("[Competition Change] Error:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchFixturesForCompetition, selectedCompetitions, showFutureFixtures, dateWindow]);

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
        handleLoadMore,
        loadInitialFixtures,
    };
} 
