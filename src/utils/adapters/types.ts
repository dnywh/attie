import { FIXTURE_STATUS, FixtureStatusType } from "./constants";

export interface StatusObject {
  type: FixtureStatusType;
  detail: string | null;
}

export interface CommonFixture {
  id: string;
  utcDate: string;
  status: StatusObject;
  competition: {
    name: string;
    type?: string;
  };
  homeTeam: {
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}
