// ESPN
const STATUS_MAP = {
    'STATUS_FINAL': 'FINISHED',
    'STATUS_SCHEDULED': 'SCHEDULED',
};

export function adaptESPNFixture(fixture, competitionCode) {
    return {
        id: fixture.id.toString(),
        utcDate: fixture.date,
        status: STATUS_MAP[fixture.status.type.name] || fixture.status.type.name,
        competition: {
            name: competitionCode, // Why is this necessary?
            type: 'LEAGUE' // Why is this necessary?
        },
        homeTeam: {
            name: fixture.competitions[0].competitors[0].team.name, // St Kilda
            shortName: fixture.competitions[0].competitors[0].team.shortDisplayName, // St Kilda
            crest: fixture.competitions[0].competitors[0].team.logo
        },
        awayTeam: {
            name: fixture.competitions[0].competitors[1].team.name,
            shortName: fixture.competitions[0].competitors[1].team.shortDisplayName,
            crest: fixture.competitions[0].competitors[1].team.logo
        },
        score: {
            fullTime: {
                home: fixture.competitions[0].competitors[0].score,
                away: fixture.competitions[0].competitors[1].score
            }
        }
    };
} 
