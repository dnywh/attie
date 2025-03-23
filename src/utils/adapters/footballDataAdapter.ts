import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "./types";

const STATUS_MAP: Record<string, string> = {
  TIMED: FIXTURE_STATUS.SCHEDULED,
  SCHEDULED: FIXTURE_STATUS.SCHEDULED,
  LIVE: FIXTURE_STATUS.LIVE,
  IN_PLAY: FIXTURE_STATUS.LIVE,
  PAUSED: FIXTURE_STATUS.LIVE,
  FINISHED: FIXTURE_STATUS.FINISHED,
  AWARDED: FIXTURE_STATUS.FINISHED,
  POSTPONED: FIXTURE_STATUS.POSTPONED,
  SUSPENDED: FIXTURE_STATUS.SUSPENDED,
  CANCELLED: FIXTURE_STATUS.CANCELLED,
};

export const adaptFootballDataFixture = (
  rawFixture: any,
  competition: any
): CommonFixture => {
  return {
    id: rawFixture.id,
    utcDate: rawFixture.utcDate,
    status: {
      type: STATUS_MAP[rawFixture.status] || rawFixture.status,
      detail: null,
    },
    competition: {
      name: competition.name,
      type: competition.type,
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
        away: rawFixture.score.fullTime.away,
      },
    },
  };
};
