import Foundation

public struct SportDefinition: Equatable, Sendable {
    public var name: String
    public var localName: String?

    public init(name: String, localName: String? = nil) {
        self.name = name
        self.localName = localName
    }
}

public struct CompetitionDefinition: Equatable, Sendable {
    public var sport: SportKey
    public var name: String
    public var isDefaultForSport: Bool

    public init(
        sport: SportKey,
        name: String,
        isDefaultForSport: Bool = false
    ) {
        self.sport = sport
        self.name = name
        self.isDefaultForSport = isDefaultForSport
    }
}

public enum AttieCatalog {
    public static let sports: [SportKey: SportDefinition] = [
        .americanFootball: SportDefinition(name: "American Football", localName: "Football"),
        .aussieRules: SportDefinition(name: "Aussie Rules"),
        .baseball: SportDefinition(name: "Baseball"),
        .basketball: SportDefinition(name: "Basketball"),
        .football: SportDefinition(name: "Football"),
        .rugbyLeague: SportDefinition(name: "Rugby League"),
        .rugbyUnion: SportDefinition(name: "Rugby Union")
    ]

    public static let competitions: [CompetitionKey: CompetitionDefinition] = [
        .afl: CompetitionDefinition(sport: .aussieRules, name: "AFL", isDefaultForSport: true),
        .nrl: CompetitionDefinition(sport: .rugbyLeague, name: "NRL", isDefaultForSport: true),
        .premierLeague: CompetitionDefinition(sport: .football, name: "Premier League", isDefaultForSport: true),
        .faCup: CompetitionDefinition(sport: .football, name: "FA Cup"),
        .championship: CompetitionDefinition(sport: .football, name: "Championship"),
        .championsLeague: CompetitionDefinition(sport: .football, name: "UEFA Champions League"),
        .europaLeague: CompetitionDefinition(sport: .football, name: "UEFA Europa League"),
        .laLiga: CompetitionDefinition(sport: .football, name: "La Liga"),
        .serieA: CompetitionDefinition(sport: .football, name: "Serie A"),
        .bundesliga: CompetitionDefinition(sport: .football, name: "Bundesliga"),
        .ligue1: CompetitionDefinition(sport: .football, name: "Ligue 1"),
        .ligaPortugal: CompetitionDefinition(sport: .football, name: "Primeira Liga"),
        .eredivisie: CompetitionDefinition(sport: .football, name: "Eredivisie"),
        .brasileirao: CompetitionDefinition(sport: .football, name: "Brasileiro Serie A"),
        .nba: CompetitionDefinition(sport: .basketball, name: "NBA", isDefaultForSport: true),
        .wnba: CompetitionDefinition(sport: .basketball, name: "WNBA"),
        .collegeBasketballMen: CompetitionDefinition(sport: .basketball, name: "NCAAM college basketball"),
        .collegeBasketballWomen: CompetitionDefinition(sport: .basketball, name: "NCAAW college basketball"),
        .mlb: CompetitionDefinition(sport: .baseball, name: "MLB", isDefaultForSport: true),
        .collegeBaseball: CompetitionDefinition(sport: .baseball, name: "NCAA college baseball"),
        .nfl: CompetitionDefinition(sport: .americanFootball, name: "NFL", isDefaultForSport: true),
        .collegeFootball: CompetitionDefinition(sport: .americanFootball, name: "NCAA college football"),
        .superRugby: CompetitionDefinition(sport: .rugbyUnion, name: "Super Rugby", isDefaultForSport: true),
        .unitedRugbyChampionship: CompetitionDefinition(sport: .rugbyUnion, name: "United Rugby Championship")
    ]

    public static func competitions(for sport: SportKey) -> [CompetitionKey] {
        CompetitionKey.allCases.filter { competitions[$0]?.sport == sport }
    }

    public static func defaultCompetition(for sport: SportKey) -> CompetitionKey? {
        competitions(for: sport).first { competitions[$0]?.isDefaultForSport == true }
    }
}

public enum AttieDefaults {
    public static let sport = SportKey.football
    public static let competitions = [CompetitionKey.premierLeague]
    public static let direction = Direction.backwards
}
