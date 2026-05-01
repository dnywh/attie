import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture, CompetitionConfig, ScoreValue } from "@/types/domain";

interface NBAFixture {
  id: number | string;
  datetime: string;
  status: string;
  home_team: BallDontLieTeam;
  visitor_team: BallDontLieTeam;
  home_team_score: ScoreValue;
  visitor_team_score: ScoreValue;
}

interface BallDontLieTeam {
  full_name: string;
  name: string;
  abbreviation: string;
}

const STATUS_MAP: Record<string, string> = {
  "1st Qtr": FIXTURE_STATUS.LIVE,
  "2nd Qtr": FIXTURE_STATUS.LIVE,
  Halftime: FIXTURE_STATUS.LIVE,
  "3rd Qtr": FIXTURE_STATUS.LIVE,
  "4th Qtr": FIXTURE_STATUS.LIVE,
  Final: FIXTURE_STATUS.FINISHED,
};

export const adaptNBAFixture = (
  rawFixture: unknown,
  competition: CompetitionConfig
): CommonFixture => {
  const fixture = rawFixture as NBAFixture;

  // NBA endpoint doesn't have a concept of 'TIMED' or 'SCHEDULED' matches, only the dateTime for that upcoming fixture
  // Therefore we need to programmatically determine if the status should be 'SCHEDULED' by checking if it is a datetime string
  const isDateTimeStatus = fixture.status.match(/^\d{4}-\d{2}-\d{2}T/);

  // Calculate base status
  const status = isDateTimeStatus
    ? FIXTURE_STATUS.SCHEDULED
    : STATUS_MAP[fixture.status] || fixture.status;

  // Create status object with optional detail
  const statusObject = {
    type: status,
    detail: isDateTimeStatus ? null : fixture.status,
  };

  return {
    id: fixture.id.toString(),
    utcDate: fixture.datetime,
    status: statusObject,
    competition: {
      name: competition.name,
    },
    homeTeam: {
      name: fixture.home_team.full_name,
      shortName: fixture.home_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/${fixture.home_team.abbreviation}.png&h=112&w=112`,
    },
    awayTeam: {
      name: fixture.visitor_team.full_name,
      shortName: fixture.visitor_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/${fixture.visitor_team.abbreviation}.png&h=112&w=112`,
    },
    score: {
      fullTime: {
        home: fixture.home_team_score,
        away: fixture.visitor_team_score,
      },
    },
  };
};
