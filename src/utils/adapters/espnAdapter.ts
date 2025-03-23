import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture } from "./types";

const STATUS_MAP: Record<string, string> = {
  STATUS_SCHEDULED: FIXTURE_STATUS.SCHEDULED,
  STATUS_IN_PROGRESS: FIXTURE_STATUS.LIVE,
  STATUS_HALFTIME: FIXTURE_STATUS.LIVE,
  STATUS_FINAL: FIXTURE_STATUS.FINISHED,
  STATUS_FULL_TIME: FIXTURE_STATUS.FINISHED,
};

export const adaptESPNFixture = (
  rawFixture: any,
  competition: any
): CommonFixture | null => {
  // Get the first competition (there should only be one per fixture)
  const fixtureCompetition = rawFixture.competitions[0];

  if (!fixtureCompetition) {
    console.error("No competition found in fixture:", rawFixture);
    return null;
  }

  let status =
    STATUS_MAP[fixtureCompetition.status.type.name] ||
    fixtureCompetition.status.type.name;

  // Create status object with optional detail
  const statusObject = {
    type: status,
    detail: fixtureCompetition.status.type.shortDetail
      ? fixtureCompetition.status.type.shortDetail
      : null,
  };

  // Get the competitors
  const homeTeam = fixtureCompetition.competitors.find(
    (c: any) => c.homeAway === "home"
  );
  const awayTeam = fixtureCompetition.competitors.find(
    (c: any) => c.homeAway === "away"
  );

  if (!homeTeam || !awayTeam) {
    console.error(
      "Could not find home or away team in fixture:",
      fixtureCompetition
    );
    return null;
  }

  return {
    id: rawFixture.id,
    utcDate: rawFixture.date,
    status: statusObject,
    competition: {
      name: competition.name,
      type: competition.type,
    },
    homeTeam: {
      name: homeTeam.team.name,
      shortName: homeTeam.team.shortDisplayName,
      crest: homeTeam.team.logo,
    },
    awayTeam: {
      name: awayTeam.team.name,
      shortName: awayTeam.team.shortDisplayName,
      crest: awayTeam.team.logo,
    },
    score: {
      fullTime: {
        home: homeTeam.score,
        away: awayTeam.score,
      },
    },
  };
};
