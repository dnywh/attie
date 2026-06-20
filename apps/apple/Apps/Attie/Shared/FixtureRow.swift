import AttieCore
import SwiftUI

struct FixtureRow: View {
    let fixture: CommonFixture
    @ObservedObject var model: FixturesViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(formattedDate)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                Text(fixture.status.detail ?? fixture.status.type)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 0) {
                teamRow(
                    team: fixture.homeTeam,
                    score: fixture.score.fullTime.home,
                    side: .home
                )
                Divider()
                teamRow(
                    team: fixture.awayTeam,
                    score: fixture.score.fullTime.away,
                    side: .away
                )
            }

            if let competitionContext {
                Text(competitionContext)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .lineLimit(1)
            }
        }
        .padding(.vertical, 4)
    }

    private func teamRow(
        team: FixtureTeam,
        score: ScoreValue,
        side: FixtureSide
    ) -> some View {
        HStack(spacing: 12) {
            AsyncImage(url: URL(string: team.crest)) { image in
                image
                    .resizable()
                    .scaledToFit()
            } placeholder: {
                Circle().fill(.secondary.opacity(0.18))
            }
            .frame(width: 28, height: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(team.shortName)
                    .font(.headline)
                Text(team.name)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            if allowsScoreReveal(fixture: fixture, direction: model.selectedDirection) {
                ScoreBubble(
                    score: score,
                    isVisible: model.isScoreVisible(fixtureID: fixture.id, side: side)
                ) {
                    model.revealScore(fixture.id, side: side)
                }
            }
        }
        .padding(.vertical, 6)
    }

    private var formattedDate: String {
        guard let date = fixtureDate(fixture.utcDate) else {
            return fixture.utcDate
        }

        return date.formatted(
            .dateTime
                .day()
                .month(.abbreviated)
                .year(.twoDigits)
                .hour()
                .minute()
        )
    }

    private var competitionContext: String? {
        if let stage = fixture.competition.stage, !stage.isEmpty {
            return model.selectedCompetitions.count > 1
                ? "\(fixture.competition.name) · \(stage)"
                : stage
        }

        return model.selectedCompetitions.count > 1 ? fixture.competition.name : nil
    }
}
