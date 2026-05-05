import AttieCore
import SwiftUI

struct WatchFixturesView: View {
    @StateObject private var model = FixturesViewModel(mode: .watchMirror)

    var body: some View {
        NavigationStack {
            List {
                statusRow

                if model.isLoading {
                    ProgressView("Loading")
                } else if model.fixtures.isEmpty {
                    emptyRow
                } else {
                    ForEach(model.fixtures) { fixture in
                        WatchFixtureRow(
                            fixture: fixture,
                            showsCompetition: model.selectedCompetitions.count > 1,
                            allowsScoreReveal: model.selectedDirection == .backwards,
                            isScoreVisible: model.isFixtureScoreVisible(fixture.id)
                        ) {
                            model.revealFixture(fixture.id)
                        }
                    }
                }

                if model.hasRateLimitError {
                    Text("Rate limit reached. Try again in a minute.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Attie")
            .task {
                if model.fixtures.isEmpty {
                    await model.loadInitialFixtures()
                }
            }
            .refreshable {
                await model.loadInitialFixtures()
            }
        }
    }

    @ViewBuilder
    private var statusRow: some View {
        if let latestSyncedAt = model.latestSyncedAt {
            Text("Synced \(latestSyncedAt, style: .relative)")
                .font(.footnote)
                .foregroundStyle(.secondary)
        } else if !model.fixtures.isEmpty {
            Text("Loaded on Watch")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
    }

    private var emptyRow: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(model.selectedCompetitions.isEmpty ? "No competitions selected" : "No fixtures found")
                .font(.headline)
            Text("Open Attie on iPhone to sync selections, or pull to refresh on Watch.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 4)
    }
}
