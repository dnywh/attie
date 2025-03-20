export const PRESETS = {
    // The names of these presets do not need to map to competitons
    // They are just what I find short and logical a lot of the time

    // Individual competition presets
    'nfl': {
        name: 'National Football League (NFL)',
        sport: 'americanFootball',
        competitions: ['nfl'],
        direction: false
    },
    'mlb': {
        name: 'Major League Baseball (MLB)',
        sport: 'baseball',
        competitions: ['mlb'],
        direction: false
    },
    'nba': {
        name: 'National Basketball League (NBA)',
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
