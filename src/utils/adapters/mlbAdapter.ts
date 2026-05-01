import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture, CompetitionConfig, ScoreValue } from "@/types/domain";

interface MLBFixture {
  id: number | string;
  date: string;
  status: string;
  home_team: BallDontLieTeam;
  away_team: BallDontLieTeam;
  home_team_data: {
    runs: ScoreValue;
  };
  away_team_data: {
    runs: ScoreValue;
  };
}

interface BallDontLieTeam {
  display_name?: string;
  full_name?: string;
  name: string;
  abbreviation: string;
}

const STATUS_MAP: Record<string, string> = {
  STATUS_SCHEDULED: FIXTURE_STATUS.SCHEDULED,
  STATUS_IN_PROGRESS: FIXTURE_STATUS.LIVE,
  STATUS_FINAL: FIXTURE_STATUS.FINISHED,
};

export const adaptMLBFixture = (
  rawFixture: unknown,
  competition: CompetitionConfig
): CommonFixture => {
  const fixture = rawFixture as MLBFixture;

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
      name: fixture.home_team.display_name ?? fixture.home_team.name,
      shortName: fixture.home_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${fixture.home_team.abbreviation}.png&h=112&w=112`,
    },
    awayTeam: {
      name: fixture.away_team.full_name ?? fixture.away_team.name,
      shortName: fixture.away_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${fixture.away_team.abbreviation}.png&h=112&w=112`,
    },
    score: {
      fullTime: {
        home: fixture.home_team_data.runs,
        away: fixture.away_team_data.runs,
      },
    },
  };
};
