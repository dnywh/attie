// Use nice, literal, camel-case names for the keys as these are used for slugs on individually generated competition pages
export const COMPETITIONS = {
    'afl': {
        sport: 'aussie-rules',
        name: 'AFL',
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
        defaultForSport: true,
        api: {
            // adapter: 'football-data',
            // code: 'PL',
            adapter: 'espn',
            sport: 'soccer',
            league: 'eng.1'
        },
    },
    'fa-cup': {
        sport: 'football',
        name: 'FA Cup',
        api: {
            adapter: 'espn',
            sport: 'soccer',
            league: 'eng.fa'
        },
    },
    'championship': {
        sport: 'football',
        name: 'Championship',
        api: {
            adapter: 'football-data',
            code: 'ELC',
        },
    },
    'champions-league': {
        sport: 'football',
        name: 'UEFA Champions League',
        api: {
            adapter: 'football-data',
            code: 'CL',
        },
    },
    'europa-league': {
        sport: 'football',
        name: 'UEFA Europa League',
        api: {
            adapter: 'espn',
            sport: 'soccer',
            league: 'UEFA.EUROPA',
        },
    },
    'la-liga': {
        sport: 'football',
        name: 'La Liga',
        api: {
            adapter: 'football-data',
            code: 'PD', // Primera Division (La Liga)
        },
    },
    'serie-a': {
        sport: 'football',
        name: 'Serie A',
        api: {
            adapter: 'football-data',
            code: 'SA',
        },
    },
    'bundesliga': {
        sport: 'football',
        name: 'Bundesliga',
        api: {
            adapter: 'football-data',
            code: 'BL1',
        },
    },
    'ligue-1': {
        sport: 'football',
        name: 'Ligue 1',
        api: {
            adapter: 'football-data',
            code: 'FL1',
        },
    },
    'liga-portugal': {
        sport: 'football',
        name: 'Primeira Liga',
        api: {
            adapter: 'football-data',
            code: 'PPL',
        },
    },
    'eredivisie': {
        sport: 'football',
        name: 'Eredivisie',
        api: {
            adapter: 'football-data',
            code: 'DED',
        },
    },
    'brasileirao': {
        sport: 'football',
        name: 'Brasileiro Série A', // Brasileirão
        api: {
            adapter: 'football-data',
            code: 'BSA',
        },
    },
    'nba': {
        sport: 'basketball',
        name: 'NBA',
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-nba',
        },
    },
    'wnba': {
        sport: 'basketball',
        name: 'WNBA',
        api: {
            adapter: 'espn',
            sport: 'basketball',
            league: 'wnba',
        },
    },
    'college-basketball-men': {
        sport: 'basketball',
        name: 'NCAAM college basketball',
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
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-mlb',
        },
    },
    'college-baseball': {
        sport: 'baseball',
        name: 'NCAA college baseball',
        api: {
            adapter: 'espn',
            sport: 'baseball',
            league: 'college-baseball',
        },
    },
    'nfl': {
        sport: 'american-football',
        name: 'NFL',
        defaultForSport: true,
        api: {
            adapter: 'balldontlie-nfl',
        },
    },
    'college-football': {
        sport: 'american-football',
        name: 'NCAA college football',
        api: {
            adapter: 'espn',
            sport: 'football',
            league: 'college-football',
        },
    },
    'super-rugby': {
        sport: 'rugby-union',
        name: 'Super Rugby',
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
