import Foundation
import Testing
@testable import AttieCore

@Suite("AttieCore contracts")
struct AttieCoreTests {
    @Test("golden fixture JSON decodes")
    func goldenFixtureJSONDecodes() throws {
        let url = try #require(Bundle.module.url(forResource: "common-fixtures", withExtension: "json"))
        let data = try Data(contentsOf: url)
        let response = try JSONDecoder().decode(FixtureListResponse.self, from: data)

        #expect(response.meta.competitions == [.premierLeague, .nba])
        #expect(response.meta.count == response.fixtures.count)
        #expect(response.fixtures.first?.homeTeam.shortName == "ARS")
        #expect(response.fixtures.first?.score.fullTime.home == .number(2))
    }

    @Test("date windows match the web defaults")
    func dateWindowsMatchWebDefaults() {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 0)!
        let today = Date(timeIntervalSince1970: 1_777_593_600) // 2026-05-01T00:00:00Z
        let initial = FixtureWindows.initialWindow(direction: .backwards)
        let next = FixtureWindows.nextWindow(after: initial, direction: .backwards)
        let range = FixtureWindows.dateRange(for: initial, today: today, calendar: calendar)

        #expect(initial == FixtureDateWindow(fromOffset: -7, toOffset: 0))
        #expect(next == FixtureDateWindow(fromOffset: -21, toOffset: -8))
        #expect(range == FixtureDateRange(dateFrom: "2026-04-24", dateTo: "2026-05-01"))
    }

    @Test("merge dedupes and sorts")
    func mergeDedupesAndSorts() {
        let older = fixture(id: "older", date: "2026-04-30T12:00:00Z")
        let newer = fixture(id: "newer", date: "2026-05-01T12:00:00Z")
        let duplicate = fixture(id: "older", date: "2026-04-30T12:00:00Z")
        let result = mergeFixtures(
            existingFixtures: [older],
            incomingFixtures: [newer, duplicate],
            direction: .backwards
        )

        #expect(result.addedCount == 1)
        #expect(result.fixtures.map(\.id) == ["newer", "older"])
    }

    @Test("preferences use localStorage-compatible keys")
    func preferencesUseCompatibleKeys() throws {
        let suiteName = "attie.tests.\(UUID().uuidString)"
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defer { defaults.removePersistentDomain(forName: suiteName) }
        let preferences = AttiePreferences(defaults: defaults)

        preferences.initialise()
        preferences.setSoundEnabled(true)
        preferences.setCompetitions([.nba], for: .basketball)

        #expect(defaults.string(forKey: AttiePreferences.Key.sport) == "football")
        #expect(defaults.string(forKey: AttiePreferences.Key.direction) == "backwards")
        #expect(defaults.bool(forKey: AttiePreferences.Key.sound) == true)
        #expect(preferences.competitions(for: .basketball) == [.nba])
    }

    private func fixture(id: String, date: String) -> CommonFixture {
        CommonFixture(
            id: id,
            utcDate: date,
            status: StatusObject(type: "FINISHED", detail: "Full-time"),
            competition: FixtureCompetition(name: "Premier League"),
            homeTeam: FixtureTeam(name: "Home", shortName: "HOM", crest: ""),
            awayTeam: FixtureTeam(name: "Away", shortName: "AWY", crest: ""),
            score: FixtureScore(fullTime: FullTimeScore(home: .number(1), away: .number(0)))
        )
    }
}
