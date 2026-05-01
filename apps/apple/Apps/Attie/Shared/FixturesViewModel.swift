import AttieCore
import Foundation
import SwiftUI

@MainActor
final class FixturesViewModel: ObservableObject {
    @Published var selectedSport: SportKey
    @Published var selectedCompetitions: [CompetitionKey]
    @Published var selectedDirection: Direction
    @Published var showAllScores = false
    @Published var useSoundEffects: Bool
    @Published var fixtures: [CommonFixture] = []
    @Published var isLoading = false
    @Published var isLoadingMore = false
    @Published var hasReachedEnd = false
    @Published var hasRateLimitError = false
    @Published var revealedScoreIDs = Set<String>()

    private let client: AttieAPIClient
    private let preferences: AttiePreferences
    private var currentWindow: FixtureDateWindow
    private var loadAttempts = 0

    init(
        client: AttieAPIClient = AttieAPIClient(),
        preferences: AttiePreferences = AttiePreferences()
    ) {
        preferences.initialise()

        let sport = preferences.sport()
        self.client = client
        self.preferences = preferences
        self.selectedSport = sport
        self.selectedCompetitions = preferences.competitions(for: sport)
        self.selectedDirection = preferences.direction()
        self.useSoundEffects = preferences.soundEnabled()
        self.currentWindow = FixtureWindows.initialWindow(direction: preferences.direction())
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
        Task { await loadInitialFixtures() }
    }

    func setDirection(_ direction: Direction) {
        selectedDirection = direction
        preferences.setDirection(direction)
        resetPaging()
        Task { await loadInitialFixtures() }
    }

    func setSoundEffects(_ enabled: Bool) {
        useSoundEffects = enabled
        preferences.setSoundEnabled(enabled)
    }

    func revealScore(_ fixtureID: String, side: FixtureSide) {
        revealedScoreIDs.insert("\(fixtureID)-\(side.rawValue)")
    }

    func isScoreVisible(fixtureID: String, side: FixtureSide) -> Bool {
        showAllScores || revealedScoreIDs.contains("\(fixtureID)-\(side.rawValue)")
    }

    func loadInitialFixtures() async {
        guard !selectedCompetitions.isEmpty else {
            fixtures = []
            isLoading = false
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
                direction: selectedDirection
            )

            fixtures = sortedFixtures(response.fixtures, direction: selectedDirection)

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

                if result.addedCount > 0 {
                    fixtures = result.fixtures
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

    private func resetPaging() {
        fixtures = []
        revealedScoreIDs = []
        hasReachedEnd = false
        hasRateLimitError = false
        loadAttempts = 0
        currentWindow = FixtureWindows.initialWindow(direction: selectedDirection)
    }
}

enum FixtureSide: String {
    case home
    case away
}
