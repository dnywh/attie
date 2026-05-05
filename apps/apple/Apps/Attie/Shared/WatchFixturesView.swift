import AttieCore
import SwiftUI

struct WatchFixturesView: View {
    @StateObject private var model = FixturesViewModel(mode: .watchMirror)

    var body: some View {
        NavigationStack {
            List {
                Picker("Direction", selection: Binding(
                    get: { model.selectedDirection },
                    set: { model.setDirection($0) }
                )) {
                    Text("Backward").tag(Direction.backwards)
                    Text("Forward").tag(Direction.forwards)
                }

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
                            isHomeScoreVisible: model.isFixtureScoreVisible(fixture.id, side: .home),
                            isAwayScoreVisible: model.isFixtureScoreVisible(fixture.id, side: .away)
                        ) {
                            model.revealNextScore(fixture.id)
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
            .safeAreaInset(edge: .bottom) {
                statusText
            }
        }
    }

    @ViewBuilder
    private var statusText: some View {
        if let latestSyncedAt = model.latestSyncedAt {
            Text("Synced \(latestSyncedAt, style: .relative)")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 8)
                .padding(.vertical, 3)
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
