const STATUS_MAP = {
    'STATUS_FINAL': 'FINISHED',
    // Anything that I don't have mapped will just come through raw, as indicated below
};

export const adaptMLBFixture = (rawFixture, competition) => {
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
            name: rawFixture.home_team.display_name, // Los Angeles Angels
            shortName: rawFixture.home_team.name, // Angels
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${rawFixture.home_team.abbreviation}.png&h=112&w=112`, // LAA
        },
        awayTeam: {
            name: rawFixture.away_team.full_name,
            shortName: rawFixture.away_team.name,
            crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${rawFixture.away_team.abbreviation}.png&h=112&w=112`,
        },
        score: {
            fullTime: {
                home: rawFixture.home_team_data.runs,
                away: rawFixture.away_team_data.runs
            }
        }
    };
}
// export function adaptMLBFixture(fixture) {
//     return {
//         id: fixture.id.toString(),
//         utcDate: fixture.date,
//         localDate: fixture.date, // Doesn't exist in schema, delete
//         status: STATUS_MAP[fixture.status] || fixture.status,
//         competition: {
//             name: 'MLB',
//             type: 'LEAGUE'
//         },
//         homeTeam: {
//             name: fixture.home_team.display_name, // Los Angeles Angels
//             shortName: fixture.home_team.name, // Angels
//             crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${fixture.home_team.abbreviation}.png&h=112&w=112`, // LAA
//         },
//         awayTeam: {
//             name: fixture.away_team.full_name,
//             shortName: fixture.away_team.name,
//             crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${fixture.away_team.abbreviation}.png&h=112&w=112`,
//         },
//         score: {
//             fullTime: {
//                 home: fixture.home_team_data.runs,
//                 away: fixture.away_team_data.runs
//             }
//         }
//     };
// } 
