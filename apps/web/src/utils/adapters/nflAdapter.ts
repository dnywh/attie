import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture, CompetitionConfig, ScoreValue } from "@/types/domain";

interface NFLFixture {
  id: number | string;
  date: string;
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
  "1st Quarter": FIXTURE_STATUS.LIVE,
  "2nd Quarter": FIXTURE_STATUS.LIVE,
  Halftime: FIXTURE_STATUS.LIVE,
  "3rd Quarter": FIXTURE_STATUS.LIVE,
  "4th Quarter": FIXTURE_STATUS.LIVE,
  "In Progress": FIXTURE_STATUS.LIVE,
  Final: FIXTURE_STATUS.FINISHED,
};

export const adaptNFLFixture = (
  rawFixture: unknown,
  competition: CompetitionConfig
): CommonFixture => {
  const fixture = rawFixture as NFLFixture;

  return {
    id: fixture.id.toString(),
    utcDate: fixture.date,
    status: {
      type: STATUS_MAP[fixture.status] || fixture.status,
      detail: null,
    },
    competition: {
      name: competition.name,
    },
    homeTeam: {
      name: fixture.home_team.full_name,
      shortName: fixture.home_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${fixture.home_team.abbreviation}.png&h=112&w=112`,
    },
    awayTeam: {
      name: fixture.visitor_team.full_name,
      shortName: fixture.visitor_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${fixture.visitor_team.abbreviation}.png&h=112&w=112`,
    },
    score: {
      fullTime: {
        home: fixture.home_team_score,
        away: fixture.visitor_team_score,
      },
    },
  };
};
