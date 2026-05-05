import Foundation

public struct WatchFixtureSnapshot: Codable, Equatable, Sendable {
    public var selectedSport: SportKey
    public var selectedCompetitions: [CompetitionKey]
    public var selectedDirection: Direction
    public var fixtures: [CommonFixture]
    public var generatedAt: Date

    public init(
        selectedSport: SportKey,
        selectedCompetitions: [CompetitionKey],
        selectedDirection: Direction,
        fixtures: [CommonFixture],
        generatedAt: Date = Date()
    ) {
        self.selectedSport = selectedSport
        self.selectedCompetitions = selectedCompetitions
        self.selectedDirection = selectedDirection
        self.fixtures = fixtures
        self.generatedAt = generatedAt
    }
}

public final class WatchFixtureSnapshotCache {
    public enum Key {
        public static let latestSnapshot = "attie.watch.latestSnapshot"
    }

    private let defaults: UserDefaults
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()

    public init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    public func load() -> WatchFixtureSnapshot? {
        guard let data = defaults.data(forKey: Key.latestSnapshot) else {
            return nil
        }

        return try? decoder.decode(WatchFixtureSnapshot.self, from: data)
    }

    public func save(_ snapshot: WatchFixtureSnapshot) {
        guard let data = try? encoder.encode(snapshot) else {
            return
        }

        defaults.set(data, forKey: Key.latestSnapshot)
    }

    public func clear() {
        defaults.removeObject(forKey: Key.latestSnapshot)
    }
}

public struct WatchFixtureSelection: Equatable, Sendable {
    public var selectedSport: SportKey
    public var selectedCompetitions: [CompetitionKey]
    public var selectedDirection: Direction

    public init(
        selectedSport: SportKey,
        selectedCompetitions: [CompetitionKey],
        selectedDirection: Direction
    ) {
        self.selectedSport = selectedSport
        self.selectedCompetitions = selectedCompetitions
        self.selectedDirection = selectedDirection
    }

    public static func resolved(
        snapshot: WatchFixtureSnapshot?,
        preferences: AttiePreferences
    ) -> WatchFixtureSelection {
        if let snapshot {
            return WatchFixtureSelection(
                selectedSport: snapshot.selectedSport,
                selectedCompetitions: snapshot.selectedCompetitions,
                selectedDirection: snapshot.selectedDirection
            )
        }

        let sport = preferences.sport()

        return WatchFixtureSelection(
            selectedSport: sport,
            selectedCompetitions: preferences.competitions(for: sport),
            selectedDirection: preferences.direction()
        )
    }
}

public struct FixtureScoreRevealState: Equatable, Sendable {
    private var revealedScoreIDs: Set<String>

    public init(revealedScoreIDs: Set<String> = []) {
        self.revealedScoreIDs = revealedScoreIDs
    }

    public mutating func revealScore(fixtureID: String, sideID: String) {
        revealedScoreIDs.insert(key(fixtureID: fixtureID, sideID: sideID))
    }

    public func isScoreRevealed(fixtureID: String, sideID: String) -> Bool {
        revealedScoreIDs.contains(key(fixtureID: fixtureID, sideID: sideID))
    }

    public mutating func reset() {
        revealedScoreIDs.removeAll()
    }

    private func key(fixtureID: String, sideID: String) -> String {
        "\(fixtureID)-\(sideID)"
    }
}
