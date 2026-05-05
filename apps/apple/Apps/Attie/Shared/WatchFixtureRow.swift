import AttieCore
import SwiftUI

struct WatchFixtureRow: View {
    let fixture: CommonFixture
    let showsCompetition: Bool
    let isScoreVisible: Bool
    let revealScores: () -> Void

    var body: some View {
        Button(action: revealScores) {
            VStack(alignment: .leading, spacing: 6) {
                HStack(alignment: .firstTextBaseline) {
                    Text(formattedTime)
                    Spacer()
                    Text(fixture.status.detail ?? fixture.status.type)
                }
                .font(.caption2)
                .foregroundStyle(.secondary)

                teamLine(team: fixture.homeTeam, score: fixture.score.fullTime.home)
                teamLine(team: fixture.awayTeam, score: fixture.score.fullTime.away)

                if showsCompetition {
                    Text(fixture.competition.name)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityHint(isScoreVisible ? "Scores revealed" : "Reveals scores for this fixture")
    }

    private func teamLine(team: FixtureTeam, score: ScoreValue) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(team.shortName)
                .font(.headline)
                .lineLimit(1)
            Spacer()
            if isScoreVisible {
                Text(score.displayValue)
                    .font(.headline)
                    .monospacedDigit()
            } else {
                Image(systemName: "eye.slash")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .accessibilityLabel("Score hidden")
            }
        }
    }

    private var formattedTime: String {
        let formatter = ISO8601DateFormatter()
        let date = formatter.date(from: fixture.utcDate) ?? Date()

        return date.formatted(
            .dateTime
                .weekday(.abbreviated)
                .hour()
                .minute()
        )
    }
}
