import AttieCore
import SwiftUI

struct WatchFixtureRow: View {
    let fixture: CommonFixture
    let showsCompetition: Bool
    let allowsScoreReveal: Bool
    let isHomeScoreVisible: Bool
    let isAwayScoreVisible: Bool
    let revealScores: () -> Void

    var body: some View {
        if allowsScoreReveal {
            Button(action: revealScores) {
                content
            }
            .buttonStyle(.plain)
            .accessibilityHint(accessibilityHint)
        } else {
            content
        }
    }

    private var content: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .firstTextBaseline) {
                Text(formattedTime)
                Spacer()
                Text(fixture.status.detail ?? fixture.status.type)
            }
            .font(.caption2)
            .foregroundStyle(.secondary)

            teamLine(
                team: fixture.homeTeam,
                score: fixture.score.fullTime.home,
                isScoreVisible: isHomeScoreVisible
            )
            teamLine(
                team: fixture.awayTeam,
                score: fixture.score.fullTime.away,
                isScoreVisible: isAwayScoreVisible
            )

            if let competitionContext {
                Text(competitionContext)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .contentShape(Rectangle())
    }

    private func teamLine(
        team: FixtureTeam,
        score: ScoreValue,
        isScoreVisible: Bool
    ) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(team.shortName)
                .font(.headline)
                .lineLimit(1)
            Spacer()
            if allowsScoreReveal, isScoreVisible {
                Text(score.displayValue)
                    .font(.headline)
                    .monospacedDigit()
            } else if allowsScoreReveal {
                Image(systemName: "eye.slash")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .accessibilityLabel("Score hidden")
            }
        }
    }

    private var accessibilityHint: String {
        if !allowsScoreReveal {
            return "Scores are unavailable for upcoming fixtures"
        }

        if isHomeScoreVisible, isAwayScoreVisible {
            return "Scores revealed"
        }

        return isHomeScoreVisible ? "Reveals the second score" : "Reveals the first score"
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

    private var competitionContext: String? {
        if let stage = fixture.competition.stage, !stage.isEmpty {
            return showsCompetition ? "\(fixture.competition.name) · \(stage)" : stage
        }

        return showsCompetition ? fixture.competition.name : nil
    }
}
