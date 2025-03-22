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
        name: 'AFL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'espn',
            sport: 'australian-football',
            league: 'afl',
        },
    },
    'nrl': {
        sport: 'rugby-league',
        name: 'NRL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'espn',
            sport: 'rugby-league',
            league: '3',
        },
    },
    'premier-league': {
        sport: 'football',
        name: 'Premier League',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'football-data',
            code: 'PL',
        },
    },
    'champions-league': {
        sport: 'football',
        name: 'UEFA Champions League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'CL',
        },
    },
    'europa-league': {
        sport: 'football',
        name: 'UEFA Europa League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'soccer',
            league: 'UEFA.EUROPA',
        },
    },
    'la-liga': {
        sport: 'football',
        name: 'La Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'PD', // Primera Division (La Liga)
        },
    },
    'championship': {
        sport: 'football',
        name: 'Championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'ELC',
        },
    },
    'serie-a': {
        sport: 'football',
        name: 'Serie A',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'SA',
        },
    },
    'bundesliga': {
        sport: 'football',
        name: 'Bundesliga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'BL1',
        },
    },
    'ligue-1': {
        sport: 'football',
        name: 'Ligue 1',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'FL1',
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
        name: 'Eredivisie',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'DED',
        },
    },
    'brasileirao': {
        sport: 'football',
        name: 'Brasileiro Série A', // Brasileirão
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'football-data',
            code: 'BSA',
        },
    },
    'nba': {
        sport: 'basketball',
        name: 'NBA',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-nba',
        },
    },
    'wnba': {
        sport: 'basketball',
        name: 'WNBA',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'basketball',
            league: 'wnba',
        },
    },
    'college-basketball-men': {
        sport: 'basketball',
        name: 'NCAAM college basketball',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'basketball',
            league: 'mens-college-basketball',
            groups: 100, // Required for college basketball, 100 for all, or 80 for each D1 conference/divisions
        },
    },
    'college-basketball-women': {
        sport: 'basketball',
        name: 'NCAAW college basketball',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'basketball',
            league: 'womens-college-basketball',
            groups: 100, // Required for college basketball, 100 or 50
        },
    },

    'mlb': {
        sport: 'baseball',
        name: 'MLB',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-mlb',
        },
    },
    'college-baseball': {
        sport: 'baseball',
        name: 'NCAA college baseball',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'baseball',
            league: 'college-baseball',
        },
    },
    'nfl': {
        sport: 'american-football',
        name: 'NFL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-nfl',
        },
    },
    'college-football': {
        sport: 'american-football',
        name: 'NCAA college football',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'football',
            league: 'college-football',
        },
    },
    'super-rugby': {
        sport: 'rugby-union',
        name: 'Super Rugby',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            adapter: 'espn',
            sport: 'rugby',
            league: '242041',
        },
    },
    'united-rugby-championship': {
        sport: 'rugby-union',
        name: 'United Rugby Championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            adapter: 'espn',
            sport: 'rugby',
            league: '270557',
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
