export const COMPETITION_TYPES = {
    LEAGUE: 'league',
    CUP: 'cup',
};

export const TIERS = {
    FREE: 'free',
    PAID: 'pro',
};

// Use nice, literal, camel-case names for the keys as these are used for slugs on individually generated competition pages
export const COMPETITIONS = {
    'afl': {
        sport: 'aussie-rules',
        code: 'afl',
        name: 'AFL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'espn-alpha',
        },
    },
    'nrl': {
        sport: 'rugby-league',
        code: 'nrl',
        name: 'NRL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'espn-alpha',
        },
    },
    'premier-league': {
        sport: 'football',
        code: 'PL',
        name: 'Premier League',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'football-data',
        },
    },
    'champions-league': {
        sport: 'football',
        code: 'CL',
        name: 'UEFA Champions League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'la-liga': {
        sport: 'football',
        code: 'PD', // Primera Division (La Liga)
        name: 'La Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'championship': {
        sport: 'football',
        code: 'ELC',
        name: 'Championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'serie-a': {
        sport: 'football',
        code: 'SA',
        name: 'Serie A',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'bundesliga': {
        sport: 'football',
        code: 'BL1',
        name: 'Bundesliga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'ligue-1': {
        sport: 'football',
        code: 'FL1',
        name: 'Ligue 1',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'liga-portugal': {
        sport: 'football',
        code: 'PPL',
        name: 'Primeira Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'eredivisie': {
        sport: 'football',
        code: 'DED',
        name: 'Eredivise',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'brasileirao': {
        sport: 'football',
        code: 'BSA',
        name: 'Brasileiro Série A', // Brasileirão
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
        },
    },
    'nba': {
        sport: 'basketball',
        code: 'nba',
        name: 'NBA',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-nba',
        },
    },
    'mlb': {
        sport: 'baseball',
        code: 'mlb',
        name: 'MLB',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-mlb',
        },
    },
    'nfl': {
        sport: 'american-football',
        code: 'nfl',
        name: 'NFL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-nfl',
        },
    },
    'super-rugby': {
        sport: 'rugby-union',
        name: 'Super Rugby',
        code: 'super-rugby', // Looked up in const competitionCode = COMPETITIONS[competition].code; TODO, replace with key
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'espn-alpha',
        },
    },
    'united-rugby-championship': {
        sport: 'rugby-union',
        name: 'United Rugby Championship',
        code: 'united-rugby-championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn-alpha',
        },
    },
};

// Helper functions
export const getDefaultCompetitionForSport = (sport) => {
    return Object.entries(COMPETITIONS).find(
        ([_, comp]) => comp.sport === sport && comp.defaultForSport
    )?.[0];
};

export const getCompetitionsForSport = (sport) => {
    return Object.entries(COMPETITIONS)
        .filter(([_, comp]) => comp.sport === sport)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
};
