const STATUS_MAP = {
    'STATUS_FINAL': 'FINISHED',
    // Anything that I don't have mapped will just come through raw, as indicated below
};

export function adaptBaseballFixture(fixture) {
    // TODO: Implement MLB-specific adaptation
    return {
        id: fixture.id.toString(),
        utcDate: fixture.date,
        localDate: fixture.date, // Doesn't exist in schema, delete
        status: STATUS_MAP[fixture.status] || fixture.status,
        competition: {
            name: 'MLB',
            type: 'LEAGUE'
        },
        homeTeam: {
            name: fixture.home_team.display_name, // Los Angeles Angels
            shortName: fixture.home_team.name, // Angels
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${fixture.home_team.abbreviation}.png&h=112&w=112`, // LAA
        },
        awayTeam: {
            name: fixture.away_team.full_name,
            shortName: fixture.away_team.name,
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${fixture.away_team.abbreviation}.png&h=112&w=112`,
        },
        score: {
            fullTime: {
                home: fixture.home_team_score,
                away: fixture.away_team_score
            }
        }
    };
} 
