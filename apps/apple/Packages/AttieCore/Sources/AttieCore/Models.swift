import Foundation

public enum Direction: String, Codable, CaseIterable, Sendable {
    case forwards
    case backwards

    public var apiDirection: ApiDirection {
        switch self {
        case .forwards:
            .future
        case .backwards:
            .past
        }
    }
}

public enum ApiDirection: String, Codable, CaseIterable, Sendable {
    case future
    case past

    public var fixtureDirection: Direction {
        switch self {
        case .future:
            .forwards
        case .past:
            .backwards
        }
    }
}

public enum SportKey: String, Codable, CaseIterable, Sendable {
    case americanFootball = "american-football"
    case aussieRules = "aussie-rules"
    case baseball
    case basketball
    case football
    case rugbyLeague = "rugby-league"
    case rugbyUnion = "rugby-union"
}

public enum CompetitionKey: String, Codable, CaseIterable, Sendable {
    case afl
    case nrl
    case premierLeague = "premier-league"
    case faCup = "fa-cup"
    case fifaWorldCup = "fifa-world-cup"
    case championship
    case championsLeague = "champions-league"
    case europaLeague = "europa-league"
    case laLiga = "la-liga"
    case serieA = "serie-a"
    case bundesliga
    case ligue1 = "ligue-1"
    case ligaPortugal = "liga-portugal"
    case eredivisie
    case brasileirao
    case nba
    case wnba
    case collegeBasketballMen = "college-basketball-men"
    case collegeBasketballWomen = "college-basketball-women"
    case mlb
    case collegeBaseball = "college-baseball"
    case nfl
    case collegeFootball = "college-football"
    case superRugby = "super-rugby"
    case unitedRugbyChampionship = "united-rugby-championship"
}

public enum ScoreValue: Codable, Equatable, Sendable {
    case number(Int)
    case string(String)
    case empty

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()

        if container.decodeNil() {
            self = .empty
        } else if let number = try? container.decode(Int.self) {
            self = .number(number)
        } else {
            self = .string(try container.decode(String.self))
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        switch self {
        case let .number(number):
            try container.encode(number)
        case let .string(string):
            try container.encode(string)
        case .empty:
            try container.encodeNil()
        }
    }

    public var displayValue: String {
        switch self {
        case let .number(number):
            String(number)
        case let .string(string):
            string
        case .empty:
            "-"
        }
    }
}

public struct StatusObject: Codable, Equatable, Sendable {
    public var type: String
    public var detail: String?

    public init(type: String, detail: String?) {
        self.type = type
        self.detail = detail
    }
}

public struct FixtureCompetition: Codable, Equatable, Sendable {
    public var name: String
    public var stage: String?

    public init(name: String, stage: String? = nil) {
        self.name = name
        self.stage = stage
    }
}

public struct FixtureTeam: Codable, Equatable, Sendable {
    public var name: String
    public var shortName: String
    public var crest: String

    public init(name: String, shortName: String, crest: String) {
        self.name = name
        self.shortName = shortName
        self.crest = crest
    }
}

public struct FullTimeScore: Codable, Equatable, Sendable {
    public var home: ScoreValue
    public var away: ScoreValue

    public init(home: ScoreValue, away: ScoreValue) {
        self.home = home
        self.away = away
    }
}

public struct FixtureScore: Codable, Equatable, Sendable {
    public var fullTime: FullTimeScore

    public init(fullTime: FullTimeScore) {
        self.fullTime = fullTime
    }
}

public struct CommonFixture: Codable, Identifiable, Equatable, Sendable {
    public var id: String
    public var utcDate: String
    public var status: StatusObject
    public var competition: FixtureCompetition
    public var homeTeam: FixtureTeam
    public var awayTeam: FixtureTeam
    public var score: FixtureScore

    public init(
        id: String,
        utcDate: String,
        status: StatusObject,
        competition: FixtureCompetition,
        homeTeam: FixtureTeam,
        awayTeam: FixtureTeam,
        score: FixtureScore
    ) {
        self.id = id
        self.utcDate = utcDate
        self.status = status
        self.competition = competition
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam
        self.score = score
    }
}

public struct FixtureApiMeta: Codable, Equatable, Sendable {
    public var nextCursor: Int?
    public var perPage: Int?
    public var hasMore: Bool

    public init(nextCursor: Int?, perPage: Int?, hasMore: Bool) {
        self.nextCursor = nextCursor
        self.perPage = perPage
        self.hasMore = hasMore
    }

    enum CodingKeys: String, CodingKey {
        case nextCursor = "next_cursor"
        case perPage = "per_page"
        case hasMore = "has_more"
    }
}

public struct FixtureListMeta: Codable, Equatable, Sendable {
    public var nextCursor: Int?
    public var perPage: Int?
    public var hasMore: Bool
    public var count: Int
    public var dateFrom: String
    public var dateTo: String
    public var direction: ApiDirection
    public var competitions: [CompetitionKey]

    public init(
        nextCursor: Int?,
        perPage: Int?,
        hasMore: Bool,
        count: Int,
        dateFrom: String,
        dateTo: String,
        direction: ApiDirection,
        competitions: [CompetitionKey]
    ) {
        self.nextCursor = nextCursor
        self.perPage = perPage
        self.hasMore = hasMore
        self.count = count
        self.dateFrom = dateFrom
        self.dateTo = dateTo
        self.direction = direction
        self.competitions = competitions
    }

    enum CodingKeys: String, CodingKey {
        case nextCursor = "next_cursor"
        case perPage = "per_page"
        case hasMore = "has_more"
        case count
        case dateFrom
        case dateTo
        case direction
        case competitions
    }
}

public struct FixtureListResponse: Codable, Equatable, Sendable {
    public var fixtures: [CommonFixture]
    public var meta: FixtureListMeta

    public init(fixtures: [CommonFixture], meta: FixtureListMeta) {
        self.fixtures = fixtures
        self.meta = meta
    }
}
