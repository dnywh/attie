export type Direction = "forwards" | "backwards";
export type ApiDirection = "future" | "past";

export type AdapterType =
  | "espn"
  | "football-data"
  | "balldontlie-nba"
  | "balldontlie-mlb"
  | "balldontlie-nfl";

export type SportKey =
  | "american-football"
  | "aussie-rules"
  | "baseball"
  | "basketball"
  | "football"
  | "rugby-league"
  | "rugby-union";

export interface SportDefinition {
  name: string;
  localName?: string;
}

export const SPORTS = {
  "american-football": {
    name: "American Football",
    localName: "Football",
  },
  "aussie-rules": {
    name: "Aussie Rules",
  },
  baseball: {
    name: "Baseball",
  },
  basketball: {
    name: "Basketball",
  },
  football: {
    name: "Football",
  },
  "rugby-league": {
    name: "Rugby League",
  },
  "rugby-union": {
    name: "Rugby Union",
  },
} as const satisfies Record<SportKey, SportDefinition>;

export interface EspnCompetitionApi {
  adapter: "espn";
  sport: string;
  league: string;
  groups?: number;
  limit?: number;
}

export interface FootballDataCompetitionApi {
  adapter: "football-data";
  code: string;
}

export interface BallDontLieCompetitionApi {
  adapter: "balldontlie-nba" | "balldontlie-mlb" | "balldontlie-nfl";
}

export type CompetitionApi =
  | EspnCompetitionApi
  | FootballDataCompetitionApi
  | BallDontLieCompetitionApi;

export interface CompetitionConfig {
  sport: SportKey;
  name: string;
  defaultForSport?: boolean;
  api: CompetitionApi;
}

export const COMPETITIONS = {
  afl: {
    sport: "aussie-rules",
    name: "AFL",
    defaultForSport: true,
    api: {
      adapter: "espn",
      sport: "australian-football",
      league: "afl",
    },
  },
  nrl: {
    sport: "rugby-league",
    name: "NRL",
    defaultForSport: true,
    api: {
      adapter: "espn",
      sport: "rugby-league",
      league: "3",
    },
  },
  "premier-league": {
    sport: "football",
    name: "Premier League",
    defaultForSport: true,
    api: {
      adapter: "espn",
      sport: "soccer",
      league: "eng.1",
    },
  },
  "fa-cup": {
    sport: "football",
    name: "FA Cup",
    api: {
      adapter: "espn",
      sport: "soccer",
      league: "eng.fa",
    },
  },
  "fifa-world-cup": {
    sport: "football",
    name: "FIFA World Cup",
    api: {
      adapter: "espn",
      sport: "soccer",
      league: "fifa.world",
    },
  },
  championship: {
    sport: "football",
    name: "Championship",
    api: {
      adapter: "football-data",
      code: "ELC",
    },
  },
  "champions-league": {
    sport: "football",
    name: "UEFA Champions League",
    api: {
      adapter: "football-data",
      code: "CL",
    },
  },
  "europa-league": {
    sport: "football",
    name: "UEFA Europa League",
    api: {
      adapter: "espn",
      sport: "soccer",
      league: "UEFA.EUROPA",
    },
  },
  "la-liga": {
    sport: "football",
    name: "La Liga",
    api: {
      adapter: "football-data",
      code: "PD",
    },
  },
  "serie-a": {
    sport: "football",
    name: "Serie A",
    api: {
      adapter: "football-data",
      code: "SA",
    },
  },
  bundesliga: {
    sport: "football",
    name: "Bundesliga",
    api: {
      adapter: "football-data",
      code: "BL1",
    },
  },
  "ligue-1": {
    sport: "football",
    name: "Ligue 1",
    api: {
      adapter: "football-data",
      code: "FL1",
    },
  },
  "liga-portugal": {
    sport: "football",
    name: "Primeira Liga",
    api: {
      adapter: "football-data",
      code: "PPL",
    },
  },
  eredivisie: {
    sport: "football",
    name: "Eredivisie",
    api: {
      adapter: "football-data",
      code: "DED",
    },
  },
  brasileirao: {
    sport: "football",
    name: "Brasileiro Serie A",
    api: {
      adapter: "football-data",
      code: "BSA",
    },
  },
  nba: {
    sport: "basketball",
    name: "NBA",
    defaultForSport: true,
    api: {
      adapter: "balldontlie-nba",
    },
  },
  wnba: {
    sport: "basketball",
    name: "WNBA",
    api: {
      adapter: "espn",
      sport: "basketball",
      league: "wnba",
    },
  },
  "college-basketball-men": {
    sport: "basketball",
    name: "NCAAM college basketball",
    api: {
      adapter: "espn",
      sport: "basketball",
      league: "mens-college-basketball",
      groups: 100,
    },
  },
  "college-basketball-women": {
    sport: "basketball",
    name: "NCAAW college basketball",
    api: {
      adapter: "espn",
      sport: "basketball",
      league: "womens-college-basketball",
      groups: 100,
    },
  },
  mlb: {
    sport: "baseball",
    name: "MLB",
    defaultForSport: true,
    api: {
      adapter: "balldontlie-mlb",
    },
  },
  "college-baseball": {
    sport: "baseball",
    name: "NCAA college baseball",
    api: {
      adapter: "espn",
      sport: "baseball",
      league: "college-baseball",
    },
  },
  nfl: {
    sport: "american-football",
    name: "NFL",
    defaultForSport: true,
    api: {
      adapter: "balldontlie-nfl",
    },
  },
  "college-football": {
    sport: "american-football",
    name: "NCAA college football",
    api: {
      adapter: "espn",
      sport: "football",
      league: "college-football",
    },
  },
  "super-rugby": {
    sport: "rugby-union",
    name: "Super Rugby",
    defaultForSport: true,
    api: {
      adapter: "espn",
      sport: "rugby",
      league: "242041",
    },
  },
  "united-rugby-championship": {
    sport: "rugby-union",
    name: "United Rugby Championship",
    api: {
      adapter: "espn",
      sport: "rugby",
      league: "270557",
    },
  },
} as const satisfies Record<string, CompetitionConfig>;

export type CompetitionKey = keyof typeof COMPETITIONS;

export interface StoredPreferences {
  sport: SportKey;
  competitions: CompetitionKey[];
  direction: Direction;
}

export type ScoreValue = number | string | null;

export interface StatusObject {
  type: string;
  detail: string | null;
}

export interface CommonFixture {
  id: string;
  utcDate: string;
  status: StatusObject;
  competition: {
    name: string;
    stage?: string | null;
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
      home: ScoreValue;
      away: ScoreValue;
    };
  };
}

export interface FixtureApiMeta {
  next_cursor: number | null;
  per_page: number | null;
  has_more: boolean;
}

export interface FixtureListMeta extends FixtureApiMeta {
  count: number;
  dateFrom: string;
  dateTo: string;
  direction: ApiDirection;
  competitions: CompetitionKey[];
}

export interface FixtureListResponse {
  fixtures: CommonFixture[];
  meta: FixtureListMeta;
}

export const DEFAULTS = {
  SPORT: "football",
  COMPETITIONS: ["premier-league"],
  DIRECTION: "backwards",
  SOUND: false,
} as const satisfies {
  SPORT: SportKey;
  COMPETITIONS: CompetitionKey[];
  DIRECTION: Direction;
  SOUND: boolean;
};

export const isSportKey = (value: string | null | undefined): value is SportKey =>
  typeof value === "string" && Object.hasOwn(SPORTS, value);

export const isCompetitionKey = (
  value: string | null | undefined
): value is CompetitionKey =>
  typeof value === "string" && Object.hasOwn(COMPETITIONS, value);

export const getDefaultCompetitionForSport = (
  sport: SportKey
): CompetitionKey | undefined =>
  (Object.entries(COMPETITIONS) as [CompetitionKey, CompetitionConfig][]).find(
    ([, competition]) => competition.sport === sport && competition.defaultForSport
  )?.[0];

export const getCompetitionsForSport = (
  sport: SportKey
): Partial<Record<CompetitionKey, CompetitionConfig>> =>
  (Object.entries(COMPETITIONS) as [CompetitionKey, CompetitionConfig][])
    .filter(([, competition]) => competition.sport === sport)
    .reduce<Partial<Record<CompetitionKey, CompetitionConfig>>>(
      (competitions, [key, competition]) => ({
        ...competitions,
        [key]: competition,
      }),
      {}
    );
