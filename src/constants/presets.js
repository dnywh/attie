export const PRESETS = {
    // The names of these presets do not need to map to competitons
    // They are just what I find short and logical a lot of the time

    // Individual competition presets
    'nfl': {
        name: 'NFL',
        longName: 'National Football League',
        sport: 'americanFootball',
        competitions: ['nfl'],
        direction: false
    },
    'mlb': {
        name: 'MLB',
        longName: 'Major League Baseball',
        sport: 'baseball',
        competitions: ['mlb'],
        direction: false
    },
    'nba': {
        name: 'NBA',
        longName: 'National Basketball League',
        sport: 'basketball',
        competitions: ['nba'],
        direction: false
    },
    // Thematic multi-competition presets
    'eurosnob': {
        name: 'European Football',
        sport: 'football',
        competitions: ['premier-league', 'champions-league'],
        direction: false
    },
    'uk': {
        name: 'UK Football',
        sport: 'football',
        competitions: ['premier-league', 'championship'],
        direction: false
    },
}; 
