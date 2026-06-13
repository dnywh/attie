import Foundation

public struct MergeFixturesResult: Equatable, Sendable {
    public var fixtures: [CommonFixture]
    public var addedCount: Int

    public init(fixtures: [CommonFixture], addedCount: Int) {
        self.fixtures = fixtures
        self.addedCount = addedCount
    }
}

private func fixtureDate(_ value: String) -> Date {
    let fractionalFormatter = ISO8601DateFormatter()
    let fallbackFormatter = ISO8601DateFormatter()

    fractionalFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    fallbackFormatter.formatOptions = [.withInternetDateTime]

    return fractionalFormatter.date(from: value)
        ?? fallbackFormatter.date(from: value)
        ?? .distantPast
}

public func sortedFixtures(
    _ fixtures: [CommonFixture],
    direction: Direction
) -> [CommonFixture] {
    fixtures.sorted { first, second in
        let firstDate = fixtureDate(first.utcDate)
        let secondDate = fixtureDate(second.utcDate)

        switch direction {
        case .forwards:
            return firstDate < secondDate
        case .backwards:
            return firstDate > secondDate
        }
    }
}

public func isLiveFixture(_ fixture: CommonFixture) -> Bool {
    fixture.status.type == "LIVE"
}

public func allowsScoreReveal(
    fixture: CommonFixture,
    direction: Direction
) -> Bool {
    direction == .backwards || isLiveFixture(fixture)
}

public func mergeFixtures(
    existingFixtures: [CommonFixture],
    incomingFixtures: [CommonFixture],
    direction: Direction
) -> MergeFixturesResult {
    let existingIDs = Set(existingFixtures.map(\.id))
    let addedFixtures = incomingFixtures.filter { !existingIDs.contains($0.id) }

    guard !addedFixtures.isEmpty else {
        return MergeFixturesResult(fixtures: existingFixtures, addedCount: 0)
    }

    return MergeFixturesResult(
        fixtures: sortedFixtures(existingFixtures + addedFixtures, direction: direction),
        addedCount: addedFixtures.count
    )
}
