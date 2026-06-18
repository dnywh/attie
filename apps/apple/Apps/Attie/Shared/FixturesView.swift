import AttieCore
import SwiftUI

struct FixturesView: View {
    @StateObject private var model = FixturesViewModel()

    var body: some View {
        NavigationStack {
            List {
                Section("Filters") {
                    controls
                }

                if model.isLoading {
                    ProgressView("Loading fixtures")
                } else if model.fixtures.isEmpty {
                    ContentUnavailableView(
                        model.selectedCompetitions.isEmpty ? "Select a competition" : "No fixtures found",
                        systemImage: "sportscourt"
                    )
                } else {
                    Section("Fixtures") {
                        ForEach(model.fixtures) { fixture in
                            FixtureRow(fixture: fixture, model: model)
                        }

                        loadMoreRow
                    }
                }
            }
            .navigationTitle("Attie")
            .task {
                await model.loadInitialFixtures()
            }
            .refreshable {
                await model.loadInitialFixtures()
            }
        }
    }

    @ViewBuilder
    private var controls: some View {
        Picker("Sport", selection: Binding(
            get: { model.selectedSport },
            set: { model.setSport($0) }
        )) {
            ForEach(SportKey.allCases, id: \.self) { sport in
                Text(model.sportName(sport)).tag(sport)
            }
        }

        NavigationLink {
            LeagueSelectionView(model: model)
        } label: {
            HStack {
                Text("League")
                Spacer()
                Text(selectedCompetitionSummary)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }

        Picker("Direction", selection: Binding(
            get: { model.selectedDirection },
            set: { model.setDirection($0) }
        )) {
            Text("Backwards").tag(Direction.backwards)
            Text("Forwards").tag(Direction.forwards)
        }
        .pickerStyle(.segmented)

        Toggle("Show all scores", isOn: $model.showAllScores)
    }

    private var selectedCompetitionSummary: String {
        model.selectedCompetitions.isEmpty
            ? "Nothing selected"
            : model.selectedCompetitions.map(model.competitionName).joined(separator: ", ")
    }

    @ViewBuilder
    private var loadMoreRow: some View {
        if model.hasReachedEnd {
            Text(model.hasRateLimitError ? "Rate limit reached. Please try again in a minute." : "End of fixtures list")
                .font(.footnote)
                .foregroundStyle(.secondary)
        } else {
            Button {
                Task { await model.loadMore() }
            } label: {
                if model.isLoadingMore {
                    ProgressView()
                } else {
                    Text("Load more")
                }
            }
        }
    }
}

private struct LeagueSelectionView: View {
    @ObservedObject var model: FixturesViewModel

    var body: some View {
        List {
            ForEach(model.availableCompetitions, id: \.self) { competition in
                Button {
                    model.toggleCompetition(competition)
                } label: {
                    HStack {
                        Text(model.competitionName(competition))
                            .foregroundStyle(.primary)
                        Spacer()
                        if model.selectedCompetitions.contains(competition) {
                            Image(systemName: "checkmark")
                        }
                    }
                }
            }
        }
        .navigationTitle("League")
    }
}
