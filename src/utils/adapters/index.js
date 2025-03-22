import { COMPETITIONS } from '@/constants/competitions';
import { adaptESPNFixture } from '@/utils/adapters/espnAdapter';
import { adaptFootballDataFixture } from '@/utils/adapters/footballDataAdapter';
import { adaptNBAFixture } from '@/utils/adapters/nbaAdapter';
import { adaptMLBFixture } from '@/utils/adapters/mlbAdapter';
import { adaptNFLFixture } from '@/utils/adapters/nflAdapter';

const ADAPTERS = {
    'espn': adaptESPNFixture,
    'football-data': adaptFootballDataFixture,
    'balldontlie-nba': adaptNBAFixture,
    'balldontlie-mlb': adaptMLBFixture,
    'balldontlie-nfl': adaptNFLFixture,
};

export const ADAPTER_BASE_PATHS = {
    'espn': '/api/espn',
    'football-data': '/api/football-data',
    'balldontlie-nba': '/api/nba',
    'balldontlie-mlb': '/api/mlb',
    'balldontlie-nfl': '/api/nfl',
};

export const adaptFixture = (rawFixture, competitionKey) => {
    // Look up competition by its key
    const competition = COMPETITIONS[competitionKey];

    if (!competition) {
        throw new Error(`Competition ${competitionKey} not found`);
    }

    const adapter = ADAPTERS[competition.api.adapter];

    if (!adapter) {
        throw new Error(`Adapter ${competition.api.adapter} not found`);
    }

    return adapter(rawFixture, competition);
};

// Each sport adapter should return this common structure
// const commonFixtureShape = {
//     id: String,
//     utcDate: String,
//     localDate: String,
//     status: String,
//     homeTeam: {
//         id: String,
//         name: String,
//         score: Number,
//     },
//     awayTeam: {
//         id: String,
//         name: String,
//         score: Number,
//     },
//     competition: {
//         id: String,
//         name: String,
//         code: String,
//     },
//     // Optional sport-specific data
//     sportSpecific: Object,
// }; 
