import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "./types";

const STATUS_MAP: Record<string, string> = {
  Final: FIXTURE_STATUS.FINISHED,
};

export const adaptNFLFixture = (
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
      name: rawFixture.home_team.full_name,
      shortName: rawFixture.home_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${rawFixture.home_team.abbreviation}.png&h=112&w=112`,
    },
    awayTeam: {
      name: rawFixture.visitor_team.full_name,
      shortName: rawFixture.visitor_team.name,
      crest: `https://a1.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/${rawFixture.visitor_team.abbreviation}.png&h=112&w=112`,
    },
    score: {
      fullTime: {
        home: rawFixture.home_team_score,
        away: rawFixture.visitor_team_score,
      },
    },
  };
};
