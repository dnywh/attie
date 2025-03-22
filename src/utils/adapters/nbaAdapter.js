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

export function adaptNBAFixture(fixture) {
    return {
        id: fixture.id.toString(),
        utcDate: fixture.datetime,
        localDate: fixture.date,
        status: STATUS_MAP[fixture.status] || fixture.status,
        competition: {
            name: 'NBA',
            type: 'LEAGUE'
        },
        homeTeam: {
            name: fixture.home_team.full_name, // Philadelphia 76ers
            shortName: fixture.home_team.name, // 76ers
            crest: `https://interstate21.com/nba-logos/${fixture.home_team.abbreviation}.png`, // PHI
        },
        awayTeam: {
            name: fixture.visitor_team.full_name,
            shortName: fixture.visitor_team.name,
            crest: `https://interstate21.com/nba-logos/${fixture.visitor_team.abbreviation}.png`,
        },
        score: {
            fullTime: {
                home: fixture.home_team_score,
                away: fixture.visitor_team_score
            }
        }
    };
} 
