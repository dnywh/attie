import { adaptNFLFixture } from '@/utils/adapters/nflAdapter';
import { adaptBaseballFixture } from '@/utils/adapters/baseballAdapter';
import { adaptBasketballFixture } from '@/utils/adapters/basketballAdapter';
import { adaptFootballFixture } from '@/utils/adapters/footballAdapter';

// Create a common fixture interface that all sports will conform to
export const adaptFixture = (rawFixture, sport) => {
    switch (sport) {
        case 'football':
            return adaptFootballFixture(rawFixture);
        case 'basketball':
            return adaptBasketballFixture(rawFixture);
        case 'baseball':
            return adaptBaseballFixture(rawFixture);
        case 'americanFootball': // TODO for all others: case 'nfl', i.e. competition, since the adaptation is competition-based, not sport-based
            return adaptNFLFixture(rawFixture);
        default:
            throw new Error(`Sport ${sport} not supported`);
    }
};

// Each sport adapter should return this common structure
const commonFixtureShape = {
    id: String,
    utcDate: String,
    localDate: String,
    status: String,
    homeTeam: {
        id: String,
        name: String,
        score: Number,
    },
    awayTeam: {
        id: String,
        name: String,
        score: Number,
    },
    competition: {
        id: String,
        name: String,
        code: String,
    },
    // Optional sport-specific data
    sportSpecific: Object,
}; 
