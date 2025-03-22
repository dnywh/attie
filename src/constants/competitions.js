import { SPORTS } from "@/config/sportConfig";

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
            provider: 'espn',
            endpoint: 'fooBar',
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
            provider: 'espn',
            endpoint: 'fooBar',
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
            provider: 'football-data',
            endpoint: '/v4/competitions/PL/matches',
        },
    },
    'champions-league': {
        sport: 'football',
        code: 'CL',
        name: 'UEFA Champions League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'la-liga': {
        sport: 'football',
        code: 'PD', // Primera Division (La Liga)
        name: 'La Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'championship': {
        sport: 'football',
        code: 'ELC',
        name: 'Championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'serie-a': {
        sport: 'football',
        code: 'SA',
        name: 'Serie A',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'bundesliga': {
        sport: 'football',
        code: 'BL1',
        name: 'Bundesliga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'ligue-1': {
        sport: 'football',
        code: 'FL1',
        name: 'Ligue 1',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'liga-portugal': {
        sport: 'football',
        code: 'PPL',
        name: 'Primeira Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'eredivisie': {
        sport: 'football',
        code: 'DED',
        name: 'Eredivise',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'brasileirao': {
        sport: 'football',
        code: 'BSA',
        name: 'Brasileiro Série A', // Brasileirão
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
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
            provider: 'balldontlie',
            endpoint: '/v1/games',
        }
    },
    'mlb': {
        sport: 'baseball',
        code: 'mlb',
        name: 'MLB',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            provider: 'balldontlie',
            endpoint: 'mlb/v1/games',
        }
    },
    'nfl': {
        sport: 'american-football',
        code: 'nfl',
        name: 'NFL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            provider: 'balldontlie',
            endpoint: 'nfl/v1/games',
        }
    },
    'super-rugby': {
        sport: 'rugby-union',
        name: 'Super Rugby',
        code: 'super-rugby', // Looked up in const competitionCode = COMPETITIONS[competition].code; TODO, replace with key
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
    },
    'united-rugby-championship': {
        sport: 'rugby-union',
        name: 'United Rugby Championship',
        code: 'united-rugby-championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
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
