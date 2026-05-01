import AttieCore
import SwiftUI

struct FixturesView: View {
    @StateObject private var model = FixturesViewModel()

    var body: some View {
        NavigationStack {
            List {
                controls

                if model.isLoading {
                    ProgressView("Loading fixtures")
                } else if model.fixtures.isEmpty {
                    ContentUnavailableView(
                        model.selectedCompetitions.isEmpty ? "Select a competition" : "No fixtures found",
                        systemImage: "sportscourt"
                    )
                } else {
                    ForEach(model.fixtures) { fixture in
                        FixtureRow(fixture: fixture, model: model)
                            .listRowBackground(AttieColor.card)
                    }

                    loadMoreRow
                }
            }
            .scrollContentBackground(.hidden)
            .background(AttieColor.page)
            .navigationTitle("Attie")
            .task {
                await model.loadInitialFixtures()
            }
        }
    }

    private var controls: some View {
        Section {
            Picker("Sport", selection: Binding(
                get: { model.selectedSport },
                set: { model.setSport($0) }
            )) {
                ForEach(SportKey.allCases, id: \.self) { sport in
                    Text(model.sportName(sport)).tag(sport)
                }
            }

            Menu {
                ForEach(model.availableCompetitions, id: \.self) { competition in
                    Button {
                        model.toggleCompetition(competition)
                    } label: {
                        Label(
                            model.competitionName(competition),
                            systemImage: model.selectedCompetitions.contains(competition)
                                ? "checkmark.circle.fill"
                                : "circle"
                        )
                    }
                }
            } label: {
                Label(
                    model.selectedCompetitions.isEmpty
                        ? "Nothing selected"
                        : model.selectedCompetitions.map(model.competitionName).joined(separator: ", "),
                    systemImage: "list.bullet.rectangle"
                )
            }

            Picker("Direction", selection: Binding(
                get: { model.selectedDirection },
                set: { model.setDirection($0) }
            )) {
                Text("Backwards").tag(Direction.backwards)
                Text("Forwards").tag(Direction.forwards)
            }
            .pickerStyle(.segmented)

            if model.selectedDirection == .backwards {
                Toggle("Show all scores", isOn: $model.showAllScores)
                Toggle(
                    "Sound effects",
                    isOn: Binding(
                        get: { model.useSoundEffects },
                        set: { model.setSoundEffects($0) }
                    )
                )
                .disabled(model.showAllScores)
            }
        }
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
