import { SPORTS } from "@/config/sportConfig";

export const COMPETITION_TYPES = {
    LEAGUE: 'league',
    CUP: 'cup',
};

export const TIERS = {
    FREE: 'free',
    PAID: 'pro',
};

export const COMPETITIONS = {
    'nrl': {
        sport: SPORTS.rugbyLeague.key,
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
    'epl': {
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
        code: 'CL',
        name: 'UEFA Champions League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'primera-division': {
        sport: SPORTS.football.key,
        code: 'PD',
        name: 'La Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'championship': {
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
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
        sport: SPORTS.football.key,
        code: 'BSA',
        name: 'Brasileiro Série A',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        api: {
            provider: 'football-data',
            endpoint: '/v4/competitions/CL/matches',
        },
    },
    'nba': {
        sport: SPORTS.basketball.key,
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
        sport: SPORTS.baseball.key,
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
        sport: SPORTS.americanFootball.key,
        code: 'nfl',
        name: 'NFL',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
        api: {
            provider: 'balldontlie',
            endpoint: 'nfl/v1/games',
        }
    }
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
