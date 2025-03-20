const STATUS_MAP = {
    'Final': 'FINISHED',
    // Anything that I don't have mapped will just come through raw, as indicated below
};

export function adaptNFLFixture(fixture) {
    return {
        id: fixture.id.toString(),
        utcDate: fixture.date,
        localDate: fixture.date, // Doesn't exist in schema, delete
        status: STATUS_MAP[fixture.status] || fixture.status,
        competition: {
            name: 'NFL',
            type: 'LEAGUE'
        },
        homeTeam: {
            name: fixture.home_team.full_name, // Green Bay Packers
            shortName: fixture.home_team.name, // Packers
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${fixture.home_team.abbreviation}.png&h=112&w=112`, // GB
        },
        awayTeam: {
            name: fixture.visitor_team.full_name,
            shortName: fixture.visitor_team.name,
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${fixture.visitor_team.abbreviation}.png&h=112&w=112`,
        },
        score: {
            fullTime: {
                home: fixture.home_team_score,
                away: fixture.visitor_team_score
            }
        }
    };
} 
