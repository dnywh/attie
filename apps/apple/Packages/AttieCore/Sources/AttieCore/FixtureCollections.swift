import Foundation

public struct MergeFixturesResult: Equatable, Sendable {
    public var fixtures: [CommonFixture]
    public var addedCount: Int
    public var changedCount: Int

    public init(fixtures: [CommonFixture], addedCount: Int, changedCount: Int) {
        self.fixtures = fixtures
        self.addedCount = addedCount
        self.changedCount = changedCount
    }
}

public func fixtureDate(_ value: String) -> Date? {
    let fractionalFormatter = ISO8601DateFormatter()
    let internetFormatter = ISO8601DateFormatter()
    let minuteFormatter = DateFormatter()

    fractionalFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    internetFormatter.formatOptions = [.withInternetDateTime]
    minuteFormatter.locale = Locale(identifier: "en_US_POSIX")
    minuteFormatter.timeZone = TimeZone(secondsFromGMT: 0)
    minuteFormatter.dateFormat = "yyyy-MM-dd'T'HH:mmX"

    return fractionalFormatter.date(from: value)
        ?? internetFormatter.date(from: value)
        ?? minuteFormatter.date(from: value)
}

public func sortedFixtures(
    _ fixtures: [CommonFixture],
    direction: Direction
) -> [CommonFixture] {
    fixtures.sorted { first, second in
        let firstDate = fixtureDate(first.utcDate) ?? .distantPast
        let secondDate = fixtureDate(second.utcDate) ?? .distantPast

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

public func isFixtureVisibleForDirection(
    _ fixture: CommonFixture,
    direction: Direction,
    now: Date = Date()
) -> Bool {
    if isLiveFixture(fixture) {
        return true
    }

    let fixtureTime = fixtureDate(fixture.utcDate) ?? .distantPast

    switch fixture.status.type {
    case "SCHEDULED":
        return direction == .forwards && fixtureTime >= now
    case "FINISHED":
        return direction == .backwards && fixtureTime <= now
    default:
        return direction == .backwards && fixtureTime <= now
    }
}

public func visibleFixtures(
    _ fixtures: [CommonFixture],
    direction: Direction,
    now: Date = Date()
) -> [CommonFixture] {
    fixtures.filter {
        isFixtureVisibleForDirection($0, direction: direction, now: now)
    }
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
    var fixturesByID = Dictionary(
        uniqueKeysWithValues: existingFixtures.map { ($0.id, $0) }
    )
    var addedCount = 0
    var changedCount = 0

    for incomingFixture in incomingFixtures {
        guard let existingFixture = fixturesByID[incomingFixture.id] else {
            addedCount += 1
            changedCount += 1
            fixturesByID[incomingFixture.id] = incomingFixture
            continue
        }

        if existingFixture != incomingFixture {
            changedCount += 1
            fixturesByID[incomingFixture.id] = incomingFixture
        }
    }

    guard changedCount > 0 else {
        return MergeFixturesResult(
            fixtures: existingFixtures,
            addedCount: 0,
            changedCount: 0
        )
    }

    return MergeFixturesResult(
        fixtures: sortedFixtures(Array(fixturesByID.values), direction: direction),
        addedCount: addedCount,
        changedCount: changedCount
    )
}
