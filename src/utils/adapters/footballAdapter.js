const STATUS_MAP = {
    SCHEDULED: 'TIMED',
    LIVE: 'IN_PLAY',
    IN_PLAY: 'IN_PLAY',
    PAUSED: 'PAUSED',
    FINISHED: 'FINISHED',
    POSTPONED: 'POSTPONED',
    SUSPENDED: 'SUSPENDED',
    CANCELLED: 'CANCELLED',
};

export function adaptFootballFixture(fixture) {
    return {
        id: fixture.id.toString(),
        utcDate: fixture.utcDate,
        localDate: new Date(fixture.utcDate).toLocaleDateString(),
        status: STATUS_MAP[fixture.status] || fixture.status,
        competition: {
            name: fixture.competition.name,
            type: fixture.competition.type
        },
        homeTeam: {
            name: fixture.homeTeam.name,
            shortName: fixture.homeTeam.shortName || fixture.homeTeam.tla,
            crest: fixture.homeTeam.crest,
        },
        awayTeam: {
            name: fixture.awayTeam.name,
            shortName: fixture.awayTeam.shortName || fixture.awayTeam.tla,
            crest: fixture.awayTeam.crest,
        },
        score: {
            fullTime: {
                home: fixture.score.fullTime.home,
                away: fixture.score.fullTime.away
            }
        }
    };
} 
