// ESPN
const STATUS_MAP = {
    'STATUS_FINAL': 'FINISHED',
};

export function adaptNRLFixture(fixture) {
    console.log({ fixture })
    return {
        id: fixture.id.toString(),
        utcDate: fixture.date,
        localDate: fixture.date, // Doesn't exist in schema, delete
        status: STATUS_MAP[fixture.status.type.name] || fixture.status,
        competition: {
            name: 'NRL', // Delete?
            type: 'LEAGUE' // Delete?
        },
        homeTeam: {
            name: fixture.competitions[0].competitors[0].team.name, // Storm
            shortName: fixture.competitions[0].competitors[0].team.shortDisplayName, // Storm
            crest: fixture.competitions[0].competitors[0].team.logo // https://a.espncdn.com/i/teamlogos/rugby/teams/500/289208.png
        },
        awayTeam: {
            name: fixture.competitions[0].competitors[1].team.name, // Storm
            shortName: fixture.competitions[0].competitors[1].team.shortDisplayName, // Storm
            crest: fixture.competitions[0].competitors[1].team.logo // https://a.espncdn.com/i/teamlogos/rugby/teams/500/289208.png
        },
        score: {
            fullTime: {
                home: fixture.competitions[0].competitors[0].score,
                away: fixture.competitions[0].competitors[1].score
            }
        }
    };
} 
