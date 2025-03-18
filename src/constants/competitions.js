export const SPORTS = {
    AMERICAN_FOOTBALL: 'american football',
    AUSSIE_RULES: 'aussie rules football',
    BASKETBALL: 'basketball',
    FOOTBALL: 'football',
    RUGBY_LEAGUE: 'rugby league',
    RUGBY_UNION: 'rugby union',
    // ... future sports
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
    },
    'champions-league': {
        sport: SPORTS.FOOTBALL,
        code: 'CL',
        name: 'UEFA Champions League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.FREE,
    },
    'europa-league': {
        sport: SPORTS.FOOTBALL,
        code: 'EL',
        name: 'UEFA Europa League',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.PAID,
    },
    'primera-division': {
        sport: SPORTS.FOOTBALL,
        code: 'PD',
        name: 'La Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'championship': {
        sport: SPORTS.FOOTBALL,
        code: 'ELC',
        name: 'Championship',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'serie-a': {
        sport: SPORTS.FOOTBALL,
        code: 'SA',
        name: 'Serie A',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'bundesliga': {
        sport: SPORTS.FOOTBALL,
        code: 'BL1',
        name: 'Bundesliga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'ligue-1': {
        sport: SPORTS.FOOTBALL,
        code: 'FL1',
        name: 'Ligue 1',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'liga-portugal': {
        sport: SPORTS.FOOTBALL,
        code: 'PPL',
        name: 'Primeira Liga',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'eredivisie': {
        sport: SPORTS.FOOTBALL,
        code: 'DED',
        name: 'Eredivise',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'brasileirao': {
        sport: SPORTS.FOOTBALL,
        code: 'BSA',
        name: 'Brasileiro Série A',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
    },
    'fa-cup': {
        sport: SPORTS.FOOTBALL,
        code: 'FAC',
        name: 'FA Cup',
        type: COMPETITION_TYPES.CUP,
        tier: TIERS.PAID,
    },
    'nba': {
        sport: SPORTS.BASKETBALL,
        code: 'nba',
        name: 'NBA',
        type: COMPETITION_TYPES.LEAGUE,
        tier: TIERS.FREE,
        defaultForSport: true,
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
