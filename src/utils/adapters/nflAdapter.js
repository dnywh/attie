export function adaptNFLFixture(fixture) {
    // TODO: Implement NFL-specific adaptation
    return {
        id: fixture.id.toString(),
        utcDate: fixture.startTime,
        localDate: new Date(fixture.startTime).toLocaleDateString(),
        status: fixture.status,
        competition: {
            name: 'NFL',
            type: 'LEAGUE'
        },
        homeTeam: {
            name: fixture.homeTeam.name,
            shortName: fixture.homeTeam.abbreviation,
            // Add NFL-specific team logo URL pattern
        },
        awayTeam: {
            name: fixture.awayTeam.name,
            shortName: fixture.awayTeam.abbreviation,
            // Add NFL-specific team logo URL pattern
        },
        score: {
            fullTime: {
                home: fixture.homeScore,
                away: fixture.awayScore
            }
        }
    };
} 
