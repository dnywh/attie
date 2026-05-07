import { describe, expect, it } from "vitest";
import { COMPETITIONS } from "@/constants/competitions";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import { adaptESPNFixture } from "@/utils/adapters/espnAdapter";
import { adaptFootballDataFixture } from "@/utils/adapters/footballDataAdapter";
import { adaptMLBFixture } from "@/utils/adapters/mlbAdapter";
import { adaptNBAFixture } from "@/utils/adapters/nbaAdapter";
import { adaptNFLFixture } from "@/utils/adapters/nflAdapter";

describe("fixture adapters", () => {
  it("normalises ESPN fixtures", () => {
    const fixture = adaptESPNFixture(
      {
        id: "401",
        date: "2026-05-01T10:00:00Z",
        competitions: [
          {
            status: {
              type: {
                name: "STATUS_FINAL",
                shortDetail: "FT",
              },
            },
            competitors: [
              {
                homeAway: "home",
                score: "2",
                team: {
                  name: "Home FC",
                  shortDisplayName: "Home",
                  logo: "https://example.com/home.png",
                },
              },
              {
                homeAway: "away",
                score: "1",
                team: {
                  name: "Away FC",
                  shortDisplayName: "Away",
                  logo: "https://example.com/away.png",
                },
              },
            ],
          },
        ],
      },
      COMPETITIONS["premier-league"]
    );

    expect(fixture?.status.type).toBe(FIXTURE_STATUS.FINISHED);
    expect(fixture?.homeTeam.shortName).toBe("Home");
    expect(fixture?.score.fullTime.away).toBe("1");
  });

  it("normalises FIFA World Cup stages from ESPN fixtures", () => {
    const fixture = adaptESPNFixture(
      {
        id: "760415",
        date: "2026-07-04T19:00:00Z",
        season: {
          slug: "round-of-16",
        },
        competitions: [
          {
            status: {
              type: {
                name: "STATUS_SCHEDULED",
                shortDetail: "Scheduled",
              },
            },
            competitors: [
              {
                homeAway: "home",
                score: "0",
                team: {
                  name: "Group A Winner",
                },
              },
              {
                homeAway: "away",
                score: "0",
                team: {
                  name: "Group B Runner-up",
                },
              },
            ],
          },
        ],
      },
      COMPETITIONS["fifa-world-cup"]
    );

    expect(fixture?.competition).toEqual({
      name: "FIFA World Cup",
      stage: "Round of 16",
    });
  });

  it("normalises football-data fixtures", () => {
    const fixture = adaptFootballDataFixture(
      {
        id: 1,
        utcDate: "2026-05-01T10:00:00Z",
        status: "FINISHED",
        homeTeam: {
          name: "Home FC",
          shortName: "Home",
          tla: "HOM",
          crest: "https://example.com/home.png",
        },
        awayTeam: {
          name: "Away FC",
          shortName: "Away",
          tla: "AWY",
          crest: "https://example.com/away.png",
        },
        score: {
          fullTime: {
            home: 2,
            away: 1,
          },
        },
      },
      COMPETITIONS["championship"]
    );

    expect(fixture.status.type).toBe(FIXTURE_STATUS.FINISHED);
    expect(fixture.competition.name).toBe("Championship");
  });

  it("normalises NBA fixtures", () => {
    const fixture = adaptNBAFixture(
      {
        id: 7,
        datetime: "2026-05-01T10:00:00Z",
        status: "Final",
        home_team: {
          full_name: "Home Hoops",
          name: "Home",
          abbreviation: "HOM",
        },
        visitor_team: {
          full_name: "Away Hoops",
          name: "Away",
          abbreviation: "AWY",
        },
        home_team_score: 100,
        visitor_team_score: 98,
      },
      COMPETITIONS.nba
    );

    expect(fixture.status.type).toBe(FIXTURE_STATUS.FINISHED);
    expect(fixture.awayTeam.shortName).toBe("Away");
  });

  it("normalises MLB fixtures", () => {
    const fixture = adaptMLBFixture(
      {
        id: 8,
        date: "2026-05-01",
        status: "STATUS_FINAL",
        home_team: {
          display_name: "Home Baseball",
          name: "Home",
          abbreviation: "HOM",
        },
        away_team: {
          full_name: "Away Baseball",
          name: "Away",
          abbreviation: "AWY",
        },
        home_team_data: {
          runs: 5,
        },
        away_team_data: {
          runs: 4,
        },
      },
      COMPETITIONS.mlb
    );

    expect(fixture.status.type).toBe(FIXTURE_STATUS.FINISHED);
    expect(fixture.score.fullTime.home).toBe(5);
  });

  it("normalises NFL fixtures", () => {
    const fixture = adaptNFLFixture(
      {
        id: 9,
        date: "2026-05-01",
        status: "Final",
        home_team: {
          full_name: "Home Football",
          name: "Home",
          abbreviation: "HOM",
        },
        visitor_team: {
          full_name: "Away Football",
          name: "Away",
          abbreviation: "AWY",
        },
        home_team_score: 24,
        visitor_team_score: 21,
      },
      COMPETITIONS.nfl
    );

    expect(fixture.status.type).toBe(FIXTURE_STATUS.FINISHED);
    expect(fixture.score.fullTime.away).toBe(21);
  });
});
