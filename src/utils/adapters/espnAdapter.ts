import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture, CompetitionConfig, ScoreValue } from "@/types/domain";

interface ESPNFixture {
  id: string;
  date: string;
  competitions: ESPNFixtureCompetition[];
}

interface ESPNFixtureCompetition {
  status: {
    type: {
      name: string;
      shortDetail?: string | null;
    };
  };
  competitors: ESPNCompetitor[];
}

interface ESPNCompetitor {
  homeAway: string;
  score?: ScoreValue;
  team: {
    name: string;
    shortDisplayName?: string;
    logo?: string;
  };
}

const STATUS_MAP: Record<string, string> = {
  STATUS_SCHEDULED: FIXTURE_STATUS.SCHEDULED,
  STATUS_IN_PROGRESS: FIXTURE_STATUS.LIVE,
  STATUS_HALFTIME: FIXTURE_STATUS.LIVE,
  STATUS_END_PERIOD: FIXTURE_STATUS.LIVE, // AFL
  STATUS_FIRST_HALF: FIXTURE_STATUS.LIVE, // NRL
  STATUS_SECOND_HALF: FIXTURE_STATUS.LIVE, // NRL
  STATUS_FINAL: FIXTURE_STATUS.FINISHED,
  STATUS_FULL_TIME: FIXTURE_STATUS.FINISHED,
  STATUS_FINAL_PEN: FIXTURE_STATUS.FINISHED, // Football
  STATUS_FINAL_AET: FIXTURE_STATUS.FINISHED, // Football
};

export const adaptESPNFixture = (
  rawFixture: unknown,
  competition: CompetitionConfig
): CommonFixture | null => {
  const fixture = rawFixture as ESPNFixture;
  const fixtureCompetition = fixture.competitions[0];

  if (!fixtureCompetition) {
    console.error("No competition found in fixture:", fixture);
    return null;
  }

  const status =
    STATUS_MAP[fixtureCompetition.status.type.name] ||
    fixtureCompetition.status.type.name;

  const statusObject = {
    type: status,
    detail: fixtureCompetition.status.type.shortDetail
      ? fixtureCompetition.status.type.shortDetail
      : null,
  };

  const homeTeam = fixtureCompetition.competitors.find(
    (competitor) => competitor.homeAway === "home"
  );
  const awayTeam = fixtureCompetition.competitors.find(
    (competitor) => competitor.homeAway === "away"
  );

  if (!homeTeam || !awayTeam) {
    console.error(
      "Could not find home or away team in fixture:",
      fixtureCompetition
    );
    return null;
  }

  return {
    id: fixture.id,
    utcDate: fixture.date,
    status: statusObject,
    competition: {
      name: competition.name,
    },
    homeTeam: {
      name: homeTeam.team.name,
      shortName: homeTeam.team.shortDisplayName ?? homeTeam.team.name,
      crest: homeTeam.team.logo ?? "",
    },
    awayTeam: {
      name: awayTeam.team.name,
      shortName: awayTeam.team.shortDisplayName ?? awayTeam.team.name,
      crest: awayTeam.team.logo ?? "",
    },
    score: {
      fullTime: {
        home: homeTeam.score ?? null,
        away: awayTeam.score ?? null,
      },
    },
  };
};
