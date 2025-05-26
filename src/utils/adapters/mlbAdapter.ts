import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "./types";

const STATUS_MAP: Record<string, string> = {
  STATUS_SCHEDULED: FIXTURE_STATUS.SCHEDULED,
  STATUS_IN_PROGRESS: FIXTURE_STATUS.LIVE,
  STATUS_FINAL: FIXTURE_STATUS.FINISHED,
};

export const adaptMLBFixture = (
  rawFixture: any,
  competition: any
): CommonFixture => {
  return {
    id: rawFixture.id.toString(),
    utcDate: rawFixture.date,
    status: {
      type: STATUS_MAP[rawFixture.status] || rawFixture.status,
      detail: null,
    },
    competition: {
      name: competition.name,
    },
    homeTeam: {
      name: rawFixture.home_team.display_name,
      shortName: rawFixture.home_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${rawFixture.home_team.abbreviation}.png&h=112&w=112`,
    },
    awayTeam: {
      name: rawFixture.away_team.full_name,
      shortName: rawFixture.away_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/${rawFixture.away_team.abbreviation}.png&h=112&w=112`,
    },
    score: {
      fullTime: {
        home: rawFixture.home_team_data.runs,
        away: rawFixture.away_team_data.runs,
      },
    },
  };
};
