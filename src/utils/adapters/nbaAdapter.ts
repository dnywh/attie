import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "./types";

const STATUS_MAP: Record<string, string> = {
  "1st Qtr": FIXTURE_STATUS.LIVE,
  "2nd Qtr": FIXTURE_STATUS.LIVE,
  Halftime: FIXTURE_STATUS.LIVE,
  "3rd Qtr": FIXTURE_STATUS.LIVE,
  "4th Qtr": FIXTURE_STATUS.LIVE,
  Final: FIXTURE_STATUS.FINISHED,
};

export const adaptNBAFixture = (
  rawFixture: any,
  competition: any
): CommonFixture => {
  // NBA endpoint doesn't have a concept of 'TIMED' or 'SCHEDULED' matches, only the dateTime for that upcoming fixture
  // Therefore we need to programmatically determine if the status should be 'SCHEDULED' by checking if it is a datetime string
  const isDateTimeStatus = rawFixture.status.match(/^\d{4}-\d{2}-\d{2}T/);

  // Calculate base status
  let status = isDateTimeStatus
    ? FIXTURE_STATUS.SCHEDULED
    : STATUS_MAP[rawFixture.status] || rawFixture.status;

  // Create status object with optional detail
  const statusObject = {
    type: status,
    detail: isDateTimeStatus ? null : rawFixture.status,
  };

  return {
    id: rawFixture.id.toString(),
    utcDate: rawFixture.datetime,
    status: statusObject,
    competition: {
      name: competition.name,
      type: competition.type,
    },
    homeTeam: {
      name: rawFixture.home_team.full_name,
      shortName: rawFixture.home_team.name,
      crest: `https://interstate21.com/nba-logos/${rawFixture.home_team.abbreviation}.png`,
    },
    awayTeam: {
      name: rawFixture.visitor_team.full_name,
      shortName: rawFixture.visitor_team.name,
      crest: `https://interstate21.com/nba-logos/${rawFixture.visitor_team.abbreviation}.png`,
    },
    score: {
      fullTime: {
        home: rawFixture.home_team_score,
        away: rawFixture.visitor_team_score,
      },
    },
  };
};
