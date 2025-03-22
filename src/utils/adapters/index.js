import { COMPETITIONS } from '@/constants/competitions';
import { adaptESPNAlphaFixture } from '@/utils/adapters/espnAlphaAdapter';
import { adaptFootballDataFixture } from '@/utils/adapters/footballDataAdapter'; // renamed from adaptFDFixture
import { adaptNBAFixture } from '@/utils/adapters/nbaAdapter';
import { adaptMLBFixture } from '@/utils/adapters/mlbAdapter';
import { adaptNFLFixture } from '@/utils/adapters/nflAdapter';

const ADAPTERS = {
    'espn-alpha': adaptESPNAlphaFixture, // Specific to head-to-head formats like football, rugby, basketball
    'football-data': adaptFootballDataFixture,
    'balldontlie-nba': adaptNBAFixture,
    'balldontlie-mlb': adaptMLBFixture,
    'balldontlie-nfl': adaptNFLFixture,
};

export const adaptFixture = (rawFixture, competitionCode) => {
    const competition = Object.entries(COMPETITIONS)
        .find(([_, comp]) => comp.code === competitionCode)?.[1];

    if (!competition) {
        throw new Error(`Competition with code ${competitionCode} not found`);
    }

    const adapter = ADAPTERS[competition.api.adapter];

    if (!adapter) {
        throw new Error(`Adapter ${competition.api.adapter} not found`);
    }

    console.log(`Using ${competition.api.adapter} adapter for ${competitionCode}`);
    return adapter(rawFixture, competitionCode);
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
