export const SPORTS = {
    AMERICAN_FOOTBALL: 'americanFootball',
    // AUSSIE_RULES: 'aussie rules football',
    BASEBALL: 'baseball',
    BASKETBALL: 'basketball',
    FOOTBALL: 'football',
    // RUGBY_LEAGUE: 'rugby league',
    // RUGBY_UNION: 'rugby union',
};

export const COMPETITION_TYPES = {
    LEAGUE: 'league',
    CUP: 'cup',
};

export const TIERS = {
    FREE: 'free',
    PAID: 'paid',
};

export const COMPETITIONS = {
    'premier-league': {
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.FOOTBALL,
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
        sport: SPORTS.BASKETBALL,
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
    'mba': {
        sport: SPORTS.BASEBALL,
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
        sport: SPORTS.AMERICAN_FOOTBALL,
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
