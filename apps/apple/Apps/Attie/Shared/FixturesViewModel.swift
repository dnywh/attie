import AttieCore
import Combine
import Foundation
import SwiftUI

@MainActor
final class FixturesViewModel: ObservableObject {
    @Published var selectedSport: SportKey
    @Published var selectedCompetitions: [CompetitionKey]
    @Published var selectedDirection: Direction
    @Published var showAllScores = false
    @Published var fixtures: [CommonFixture] = []
    @Published var isLoading = false
    @Published var isLoadingMore = false
    @Published var hasReachedEnd = false
    @Published var hasRateLimitError = false
    @Published var scoreRevealState = FixtureScoreRevealState()
    @Published var isUsingSyncedSnapshot = false
    @Published var latestSyncedAt: Date?

    private let client: AttieAPIClient
    private let preferences: AttiePreferences
    private let syncService: FixtureSyncService?
    private let mode: FixturesViewMode
    private var currentWindow: FixtureDateWindow
    private var loadAttempts = 0
    private var isRefreshInFlight = false
    private var cancellables = Set<AnyCancellable>()

    init(
        client: AttieAPIClient = AttieAPIClient(),
        preferences: AttiePreferences = AttiePreferences(),
        syncService: FixtureSyncService? = .shared,
        mode: FixturesViewMode = .standard
    ) {
        preferences.initialise()

        let selection = WatchFixtureSelection.resolved(
            snapshot: mode == .watchMirror ? syncService?.latestSnapshot : nil,
            preferences: preferences
        )
        self.client = client
        self.preferences = preferences
        self.syncService = syncService
        self.mode = mode
        self.selectedSport = selection.selectedSport
        self.selectedCompetitions = selection.selectedCompetitions
        self.selectedDirection = selection.selectedDirection
        self.currentWindow = FixtureWindows.initialWindow(direction: selection.selectedDirection)

        if mode == .watchMirror, let snapshot = syncService?.latestSnapshot {
            applySyncedSnapshot(snapshot)
        }

        syncService?.$latestSnapshot
            .compactMap { $0 }
            .sink { [weak self] snapshot in
                guard self?.mode == .watchMirror else {
                    return
                }

                self?.applySyncedSnapshot(snapshot)
            }
            .store(in: &cancellables)
    }

    var availableCompetitions: [CompetitionKey] {
        AttieCatalog.competitions(for: selectedSport)
    }

    func sportName(_ sport: SportKey) -> String {
        AttieCatalog.sports[sport]?.name ?? sport.rawValue
    }

    func competitionName(_ competition: CompetitionKey) -> String {
        AttieCatalog.competitions[competition]?.name ?? competition.rawValue
    }

    func setSport(_ sport: SportKey) {
        selectedSport = sport
        selectedCompetitions = preferences.competitions(for: sport)
        preferences.setSport(sport)
        preferences.setCompetitions(selectedCompetitions, for: sport)
        resetPaging()
        publishSnapshot()
        Task { await loadInitialFixtures() }
    }

    func toggleCompetition(_ competition: CompetitionKey) {
        if selectedCompetitions.contains(competition) {
            selectedCompetitions.removeAll { $0 == competition }
        } else {
            selectedCompetitions.append(competition)
        }

        preferences.setCompetitions(selectedCompetitions, for: selectedSport)
        resetPaging()
        publishSnapshot()
        Task { await loadInitialFixtures() }
    }

    func setDirection(_ direction: Direction) {
        selectedDirection = direction
        preferences.setDirection(direction)
        resetPaging()
        publishSnapshot()
        Task { await loadInitialFixtures() }
    }

    func revealScore(_ fixtureID: String, side: FixtureSide) {
        scoreRevealState.revealScore(fixtureID: fixtureID, sideID: side.rawValue)
    }

    func isScoreVisible(fixtureID: String, side: FixtureSide) -> Bool {
        showAllScores || scoreRevealState.isScoreRevealed(fixtureID: fixtureID, sideID: side.rawValue)
    }

    func revealNextScore(_ fixtureID: String) {
        if !scoreRevealState.isScoreRevealed(fixtureID: fixtureID, sideID: FixtureSide.home.rawValue) {
            revealScore(fixtureID, side: .home)
        } else if !scoreRevealState.isScoreRevealed(fixtureID: fixtureID, sideID: FixtureSide.away.rawValue) {
            revealScore(fixtureID, side: .away)
        }
    }

    func isFixtureScoreVisible(_ fixtureID: String, side: FixtureSide) -> Bool {
        isScoreVisible(fixtureID: fixtureID, side: side)
    }

    func loadInitialFixtures() async {
        guard !selectedCompetitions.isEmpty else {
            fixtures = []
            isLoading = false
            publishSnapshot()
            return
        }

        isLoading = true
        hasRateLimitError = false
        hasReachedEnd = false
        loadAttempts = 0
        currentWindow = FixtureWindows.initialWindow(direction: selectedDirection)

        do {
            let range = FixtureWindows.dateRange(for: currentWindow)
            let response = try await client.fetchFixtures(
                competitions: selectedCompetitions,
                dateRange: range,
                direction: selectedDirection,
                refreshToken: Self.refreshToken()
            )

            fixtures = sortedFixtures(response.fixtures, direction: selectedDirection)
            isUsingSyncedSnapshot = false
            latestSyncedAt = nil
            publishSnapshot()

            if fixtures.isEmpty {
                await loadMore()
            }
        } catch AttieAPIError.rateLimited {
            hasRateLimitError = true
        } catch {
            print("[Attie] Failed to load fixtures: \(error)")
        }

        isLoading = false
    }

    func loadMore() async {
        guard !selectedCompetitions.isEmpty, !hasReachedEnd else {
            return
        }

        isLoadingMore = true

        do {
            while loadAttempts < FixtureWindows.maximumAttempts {
                loadAttempts += 1
                let nextWindow = FixtureWindows.nextWindow(
                    after: currentWindow,
                    direction: selectedDirection
                )
                let range = FixtureWindows.dateRange(for: nextWindow)
                let response = try await client.fetchFixtures(
                    competitions: selectedCompetitions,
                    dateRange: range,
                    direction: selectedDirection
                )
                let result = mergeFixtures(
                    existingFixtures: fixtures,
                    incomingFixtures: response.fixtures,
                    direction: selectedDirection
                )

                currentWindow = nextWindow

                if result.changedCount > 0 {
                    fixtures = result.fixtures
                    isUsingSyncedSnapshot = false
                    latestSyncedAt = nil
                    publishSnapshot()
                }

                if result.addedCount > 0 {
                    loadAttempts = 0
                    isLoadingMore = false
                    return
                }
            }

            hasReachedEnd = true
        } catch AttieAPIError.rateLimited {
            hasRateLimitError = true
            hasReachedEnd = true
        } catch {
            print("[Attie] Failed to load more fixtures: \(error)")
        }

        isLoadingMore = false
    }

    func refreshFixtures() async {
        guard !selectedCompetitions.isEmpty,
              !isLoading,
              !isLoadingMore,
              !isRefreshInFlight,
              !hasRateLimitError else {
            return
        }

        isRefreshInFlight = true
        defer { isRefreshInFlight = false }

        do {
            let initialWindow = FixtureWindows.initialWindow(direction: selectedDirection)
            let range = FixtureWindows.dateRange(for: initialWindow)
            let response = try await client.fetchFixtures(
                competitions: selectedCompetitions,
                dateRange: range,
                direction: selectedDirection,
                refreshToken: Self.refreshToken()
            )
            let result = mergeFixtures(
                existingFixtures: fixtures,
                incomingFixtures: response.fixtures,
                direction: selectedDirection
            )

            currentWindow = initialWindow

            if result.changedCount > 0 {
                fixtures = result.fixtures
                isUsingSyncedSnapshot = false
                latestSyncedAt = nil
                publishSnapshot()
            }
        } catch AttieAPIError.rateLimited {
            hasRateLimitError = true
        } catch {
            print("[Attie] Failed to refresh fixtures: \(error)")
        }
    }

    private func resetPaging() {
        fixtures = []
        scoreRevealState.reset()
        hasReachedEnd = false
        hasRateLimitError = false
        loadAttempts = 0
        currentWindow = FixtureWindows.initialWindow(direction: selectedDirection)
    }

    private func applySyncedSnapshot(_ snapshot: WatchFixtureSnapshot) {
        selectedSport = snapshot.selectedSport
        selectedCompetitions = snapshot.selectedCompetitions
        selectedDirection = snapshot.selectedDirection
        fixtures = sortedFixtures(snapshot.fixtures, direction: snapshot.selectedDirection)
        latestSyncedAt = snapshot.generatedAt
        isUsingSyncedSnapshot = true
        isLoading = false
        isLoadingMore = false
        hasReachedEnd = true
        hasRateLimitError = false
        currentWindow = FixtureWindows.initialWindow(direction: snapshot.selectedDirection)
        scoreRevealState.reset()
    }

    private func publishSnapshot() {
        guard mode == .standard else {
            return
        }

        syncService?.publish(
            WatchFixtureSnapshot(
                selectedSport: selectedSport,
                selectedCompetitions: selectedCompetitions,
                selectedDirection: selectedDirection,
                fixtures: fixtures
            )
        )
    }

    private static func refreshToken() -> String {
        String(Int(Date().timeIntervalSince1970 * 1000))
    }
}

enum FixtureSide: String {
    case home
    case away
}

enum FixturesViewMode {
    case standard
    case watchMirror
}
