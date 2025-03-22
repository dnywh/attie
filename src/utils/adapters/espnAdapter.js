const STATUS_MAP = {
    'STATUS_FINAL': 'FINISHED',
    'STATUS_SCHEDULED': 'SCHEDULED',
    'STATUS_IN_PROGRESS': 'IN_PLAY'
};

export const adaptESPNFixture = (rawFixture, competition) => {
    // Get the first competition (there should only be one per fixture)
    const fixtureCompetition = rawFixture.competitions[0];

    if (!fixtureCompetition) {
        console.error('No competition found in fixture:', rawFixture);
        return null;
    }

    // Get the competitors
    const homeTeam = fixtureCompetition.competitors.find(c => c.homeAway === 'home');
    const awayTeam = fixtureCompetition.competitors.find(c => c.homeAway === 'away');

    if (!homeTeam || !awayTeam) {
        console.error('Could not find home or away team in fixture:', fixtureCompetition);
        return null;
    }

    return {
        id: rawFixture.id,
        utcDate: rawFixture.date,
        status: STATUS_MAP[fixtureCompetition.status.type.name] || fixtureCompetition.status.type.name,
        competition: {
            name: competition.name,
            type: competition.type
        },
        homeTeam: {
            name: homeTeam.team.name,
            shortName: homeTeam.team.shortDisplayName,
            crest: homeTeam.team.logo
        },
        awayTeam: {
            name: awayTeam.team.name,
            shortName: awayTeam.team.shortDisplayName,
            crest: awayTeam.team.logo
        },
        score: {
            fullTime: {
                home: homeTeam.score,
                away: awayTeam.score
            }
        }
    };
} 
