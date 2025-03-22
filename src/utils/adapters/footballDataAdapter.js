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

// Enums
// https://docs.football-data.org/general/v4/match.html#_enums
// Attribute name	Possible values
// status
// SCHEDULED, TIMED, IN_PLAY, PAUSED, FINISHED, SUSPENDED, POSTPONED, CANCELLED, AWARDED
// stage
// FINAL | THIRD_PLACE | SEMI_FINALS | QUARTER_FINALS | LAST_16 | LAST_32 | LAST_64 | ROUND_4 | ROUND_3 | ROUND_2 | ROUND_1 | GROUP_STAGE | PRELIMINARY_ROUND | QUALIFICATION | QUALIFICATION_ROUND_1 | QUALIFICATION_ROUND_2 | QUALIFICATION_ROUND_3 | PLAYOFF_ROUND_1 | PLAYOFF_ROUND_2 | PLAYOFFS | REGULAR_SEASON | CLAUSURA | APERTURA | CHAMPIONSHIP_ROUND | RELEGATION_ROUND
// group
// GROUP_A | GROUP_B | GROUP_C | GROUP_D | GROUP_E | GROUP_F | GROUP_G | GROUP_H | GROUP_I | GROUP_J | GROUP_K | GROUP_L

export const adaptFootballDataFixture = (rawFixture, competition) => {
    return {
        id: rawFixture.id,
        utcDate: rawFixture.utcDate,
        localDate: rawFixture.localDate,
        status: rawFixture.status,
        competition: {
            // id: competition.api.code,
            name: competition.name,
            type: competition.type
        },
        homeTeam: {
            name: rawFixture.homeTeam.name,
            shortName: rawFixture.homeTeam.shortName || rawFixture.homeTeam.tla,
            crest: rawFixture.homeTeam.crest,
        },
        awayTeam: {
            name: rawFixture.awayTeam.name,
            shortName: rawFixture.awayTeam.shortName || rawFixture.awayTeam.tla,
            crest: rawFixture.awayTeam.crest,
        },
        score: {
            fullTime: {
                home: rawFixture.score.fullTime.home,
                away: rawFixture.score.fullTime.away
            }
        }
    };
}; 
