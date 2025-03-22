const STATUS_MAP = {
    '{start_time}': 'TIMED', // {start_time} looks something like "7:00 pm ET", which indicates that the game has not started yet.
    '1st Qtr': 'IN_PLAY',
    '2nd Qtr': 'IN_PLAY',
    'Halftime': 'IN_PLAY',
    '3rd Qtr': 'IN_PLAY',
    '4th Qtr': 'IN_PLAY',
    'Final': 'FINISHED',
    // 'In Progress': 'IN_PLAY',
};

export const adaptNBAFixture = (rawFixture, competition) => {
    return {
        id: rawFixture.id.toString(),
        utcDate: rawFixture.datetime,
        localDate: rawFixture.date,
        status: STATUS_MAP[rawFixture.status] || rawFixture.status,
        competition: {
            name: competition.name,
            type: competition.type,
        },
        homeTeam: {
            name: rawFixture.home_team.full_name, // Philadelphia 76ers
            shortName: rawFixture.home_team.name, // 76ers
            crest: `https://interstate21.com/nba-logos/${rawFixture.home_team.abbreviation}.png`, // PHI
        },
        awayTeam: {
            name: rawFixture.visitor_team.full_name,
            shortName: rawFixture.visitor_team.name,
            crest: `https://interstate21.com/nba-logos/${rawFixture.visitor_team.abbreviation}.png`,
        },
        score: {
            fullTime: {
                home: rawFixture.home_team_score,
                away: rawFixture.visitor_team_score
            }
        }
    };
} 
