import Foundation

public final class AttiePreferences {
    public enum Key {
        public static let sport = "attie.sport"
        public static let direction = "attie.direction"
        public static let sound = "attie.sound"

        public static func competitions(for sport: SportKey) -> String {
            "attie.competitions.\(sport.rawValue)"
        }
    }

    private let defaults: UserDefaults
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    public init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    public func initialise() {
        if defaults.string(forKey: Key.sport) == nil {
            setSport(AttieDefaults.sport)
            setCompetitions(AttieDefaults.competitions, for: AttieDefaults.sport)
        }

        if defaults.string(forKey: Key.direction) == nil {
            setDirection(AttieDefaults.direction)
        }
    }

    public func sport() -> SportKey {
        defaults.string(forKey: Key.sport).flatMap(SportKey.init(rawValue:))
            ?? AttieDefaults.sport
    }

    public func setSport(_ sport: SportKey) {
        defaults.set(sport.rawValue, forKey: Key.sport)
    }

    public func direction() -> Direction {
        defaults.string(forKey: Key.direction).flatMap(Direction.init(rawValue:))
            ?? AttieDefaults.direction
    }

    public func setDirection(_ direction: Direction) {
        defaults.set(direction.rawValue, forKey: Key.direction)
    }

    public func soundEnabled() -> Bool {
        guard defaults.object(forKey: Key.sound) != nil else {
            return AttieDefaults.sound
        }

        return defaults.bool(forKey: Key.sound)
    }

    public func setSoundEnabled(_ enabled: Bool) {
        defaults.set(enabled, forKey: Key.sound)
    }

    public func competitions(for sport: SportKey) -> [CompetitionKey] {
        guard
            let json = defaults.string(forKey: Key.competitions(for: sport)),
            let data = json.data(using: .utf8),
            let rawValues = try? decoder.decode([String].self, from: data)
        else {
            return fallbackCompetitions(for: sport)
        }

        let competitions = rawValues.compactMap(CompetitionKey.init(rawValue:)).filter {
            AttieCatalog.competitions[$0]?.sport == sport
        }

        return competitions.isEmpty ? fallbackCompetitions(for: sport) : competitions
    }

    public func setCompetitions(_ competitions: [CompetitionKey], for sport: SportKey) {
        let rawValues = competitions.map(\.rawValue)
        let data = (try? encoder.encode(rawValues)) ?? Data("[]".utf8)
        let json = String(data: data, encoding: .utf8) ?? "[]"

        defaults.set(json, forKey: Key.competitions(for: sport))
    }

    private func fallbackCompetitions(for sport: SportKey) -> [CompetitionKey] {
        if let defaultCompetition = AttieCatalog.defaultCompetition(for: sport) {
            return [defaultCompetition]
        }

        return AttieDefaults.competitions
    }
}
