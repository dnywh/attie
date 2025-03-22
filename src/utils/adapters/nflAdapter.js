const STATUS_MAP = {
    'Final': 'FINISHED',
    // Anything that I don't have mapped will just come through raw, as indicated below
};

export const adaptNFLFixture = (rawFixture, competition) => {
    return {
        id: rawFixture.id.toString(),
        utcDate: rawFixture.date,
        localDate: rawFixture.date, // Doesn't exist in schema, delete
        status: STATUS_MAP[rawFixture.status] || rawFixture.status,
        competition: {
            name: competition.name,
            type: competition.type,
        },
        homeTeam: {
            name: rawFixture.home_team.full_name, // Green Bay Packers
            shortName: rawFixture.home_team.name, // Packers
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${rawFixture.home_team.abbreviation}.png&h=112&w=112`, // GB
        },
        awayTeam: {
            name: rawFixture.visitor_team.full_name,
            shortName: rawFixture.visitor_team.name,
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${rawFixture.visitor_team.abbreviation}.png&h=112&w=112`,
        },
        score: {
            fullTime: {
                home: rawFixture.home_team_score,
                away: rawFixture.visitor_team_score
            }
        }
    };
} 
