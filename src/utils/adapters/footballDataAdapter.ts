import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture, CompetitionConfig, ScoreValue } from "@/types/domain";

interface FootballDataFixture {
  id: number | string;
  utcDate: string;
  status: string;
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
  score: {
    fullTime: {
      home: ScoreValue;
      away: ScoreValue;
    };
  };
}

interface FootballDataTeam {
  name: string;
  shortName?: string | null;
  tla?: string | null;
  crest: string;
}

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
  rawFixture: unknown,
  competition: CompetitionConfig
): CommonFixture => {
  const fixture = rawFixture as FootballDataFixture;

  return {
    id: String(fixture.id),
    utcDate: fixture.utcDate,
    status: {
      type: STATUS_MAP[fixture.status] || fixture.status,
      detail: null,
    },
    competition: {
      name: competition.name,
    },
    homeTeam: {
      name: fixture.homeTeam.name,
      shortName:
        fixture.homeTeam.shortName ||
        fixture.homeTeam.tla ||
        fixture.homeTeam.name,
      crest: fixture.homeTeam.crest,
    },
    awayTeam: {
      name: fixture.awayTeam.name,
      shortName:
        fixture.awayTeam.shortName ||
        fixture.awayTeam.tla ||
        fixture.awayTeam.name,
      crest: fixture.awayTeam.crest,
    },
    score: {
      fullTime: {
        home: fixture.score.fullTime.home,
        away: fixture.score.fullTime.away,
      },
    },
  };
};
