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

    @Test("catalog includes FIFA World Cup as the first default soccer competition")
    func catalogIncludesFIFAWorldCup() throws {
        let data = Data(#""fifa-world-cup""#.utf8)
        let competition = try JSONDecoder().decode(CompetitionKey.self, from: data)

        #expect(competition == .fifaWorldCup)
        #expect(AttieCatalog.sports[.football]?.name == "Soccer")
        #expect(Array(AttieCatalog.competitions(for: .football).prefix(2)) == [.fifaWorldCup, .premierLeague])
        #expect(AttieCatalog.competitions[.fifaWorldCup]?.name == "FIFA World Cup")
        #expect(AttieCatalog.competitions[.fifaWorldCup]?.isDefaultForSport == true)
        #expect(AttieCatalog.defaultCompetition(for: .football) == .fifaWorldCup)
        #expect(AttieCatalog.defaultCompetitions(for: .football) == [.fifaWorldCup, .premierLeague])
    }

    @Test("fixture competition decodes optional tournament stage")
    func fixtureCompetitionDecodesStage() throws {
        let data = Data(#"{"name":"FIFA World Cup","stage":"Round of 16"}"#.utf8)
        let competition = try JSONDecoder().decode(FixtureCompetition.self, from: data)

        #expect(competition.name == "FIFA World Cup")
        #expect(competition.stage == "Round of 16")
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
        #expect(result.changedCount == 1)
        #expect(result.fixtures.map(\.id) == ["newer", "older"])
    }

    @Test("merge replaces changed duplicate fixtures")
    func mergeReplacesChangedDuplicateFixtures() {
        let staleFixture = fixture(
            id: "live",
            date: "2026-05-01T12:00:00Z",
            status: "LIVE"
        )
        let refreshedFixture = CommonFixture(
            id: staleFixture.id,
            utcDate: staleFixture.utcDate,
            status: StatusObject(type: "FINISHED", detail: "Full-time"),
            competition: staleFixture.competition,
            homeTeam: staleFixture.homeTeam,
            awayTeam: staleFixture.awayTeam,
            score: FixtureScore(fullTime: FullTimeScore(home: .number(2), away: .number(1)))
        )
        let result = mergeFixtures(
            existingFixtures: [staleFixture],
            incomingFixtures: [refreshedFixture],
            direction: .backwards
        )

        #expect(result.addedCount == 0)
        #expect(result.changedCount == 1)
        #expect(result.fixtures == [refreshedFixture])
    }

    @Test("fixture dates parse provider timestamps without seconds")
    func fixtureDatesParseProviderTimestampsWithoutSeconds() throws {
        let date = try #require(fixtureDate("2026-06-11T19:00Z"))

        #expect(date.timeIntervalSince1970 == 1_781_204_400)
    }

    @Test("fixture visibility matches direction semantics")
    func fixtureVisibilityMatchesDirectionSemantics() {
        let now = fixtureDate("2026-05-01T12:00:00Z")!
        let scheduledFuture = fixture(
            id: "scheduled-future",
            date: "2026-05-01T14:00:00Z",
            status: "SCHEDULED"
        )
        let scheduledPast = fixture(
            id: "scheduled-past",
            date: "2026-05-01T10:00:00Z",
            status: "SCHEDULED"
        )
        let finishedPast = fixture(
            id: "finished-past",
            date: "2026-05-01T10:00:00Z",
            status: "FINISHED"
        )
        let livePast = fixture(
            id: "live-past",
            date: "2026-05-01T10:00:00Z",
            status: "LIVE"
        )

        #expect(isFixtureVisibleForDirection(scheduledFuture, direction: .forwards, now: now))
        #expect(!isFixtureVisibleForDirection(scheduledFuture, direction: .backwards, now: now))
        #expect(!isFixtureVisibleForDirection(scheduledPast, direction: .forwards, now: now))
        #expect(!isFixtureVisibleForDirection(scheduledPast, direction: .backwards, now: now))
        #expect(!isFixtureVisibleForDirection(finishedPast, direction: .forwards, now: now))
        #expect(isFixtureVisibleForDirection(finishedPast, direction: .backwards, now: now))
        #expect(isFixtureVisibleForDirection(livePast, direction: .forwards, now: now))
        #expect(isFixtureVisibleForDirection(livePast, direction: .backwards, now: now))
    }

    @Test("preferences use localStorage-compatible keys")
    func preferencesUseCompatibleKeys() throws {
        let suiteName = "attie.tests.\(UUID().uuidString)"
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defer { defaults.removePersistentDomain(forName: suiteName) }
        let preferences = AttiePreferences(defaults: defaults)

        preferences.initialise()
        preferences.setCompetitions([.nba], for: .basketball)

        #expect(defaults.string(forKey: AttiePreferences.Key.sport) == "football")
        #expect(defaults.string(forKey: AttiePreferences.Key.direction) == "backwards")
        #expect(preferences.competitions(for: .football) == [.fifaWorldCup, .premierLeague])
        #expect(preferences.competitions(for: .basketball) == [.nba])
    }

    @Test("watch fixture snapshots encode and decode")
    func watchFixtureSnapshotsEncodeAndDecode() throws {
        let snapshot = WatchFixtureSnapshot(
            selectedSport: .football,
            selectedCompetitions: [.premierLeague],
            selectedDirection: .backwards,
            fixtures: [fixture(id: "ars-che", date: "2026-05-01T12:00:00Z")],
            generatedAt: Date(timeIntervalSince1970: 1_777_593_600)
        )

        let data = try JSONEncoder().encode(snapshot)
        let decoded = try JSONDecoder().decode(WatchFixtureSnapshot.self, from: data)

        #expect(decoded == snapshot)
    }

    @Test("watch fixture selection falls back to preferences")
    func watchFixtureSelectionFallsBackToPreferences() throws {
        let suiteName = "attie.tests.\(UUID().uuidString)"
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defer { defaults.removePersistentDomain(forName: suiteName) }
        let preferences = AttiePreferences(defaults: defaults)

        preferences.initialise()

        let selection = WatchFixtureSelection.resolved(
            snapshot: nil,
            preferences: preferences
        )

        #expect(selection.selectedSport == .football)
        #expect(selection.selectedCompetitions == [.fifaWorldCup, .premierLeague])
        #expect(selection.selectedDirection == .backwards)
    }

    @Test("score reveal state reveals a single team score")
    func scoreRevealStateRevealsASingleTeamScore() {
        var state = FixtureScoreRevealState()

        state.revealScore(fixtureID: "fixture-a", sideID: "home")

        #expect(state.isScoreRevealed(fixtureID: "fixture-a", sideID: "home"))
        #expect(!state.isScoreRevealed(fixtureID: "fixture-a", sideID: "away"))
        #expect(!state.isScoreRevealed(fixtureID: "fixture-b", sideID: "home"))
    }

    @Test("live fixtures allow score reveal in both directions")
    func liveFixturesAllowScoreRevealInBothDirections() {
        let liveFixture = fixture(
            id: "live",
            date: "2026-05-01T10:00:00Z",
            status: "LIVE"
        )
        let scheduledFixture = fixture(
            id: "scheduled",
            date: "2026-05-01T14:00:00Z",
            status: "SCHEDULED"
        )

        #expect(allowsScoreReveal(fixture: liveFixture, direction: .forwards))
        #expect(allowsScoreReveal(fixture: liveFixture, direction: .backwards))
        #expect(!allowsScoreReveal(fixture: scheduledFixture, direction: .forwards))
        #expect(allowsScoreReveal(fixture: scheduledFixture, direction: .backwards))
    }

    private func fixture(id: String, date: String) -> CommonFixture {
        fixture(id: id, date: date, status: "FINISHED")
    }

    private func fixture(id: String, date: String, status: String) -> CommonFixture {
        CommonFixture(
            id: id,
            utcDate: date,
            status: StatusObject(type: status, detail: "Full-time"),
            competition: FixtureCompetition(name: "Premier League"),
            homeTeam: FixtureTeam(name: "Home", shortName: "HOM", crest: ""),
            awayTeam: FixtureTeam(name: "Away", shortName: "AWY", crest: ""),
            score: FixtureScore(fullTime: FullTimeScore(home: .number(1), away: .number(0)))
        )
    }
}
