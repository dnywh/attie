import AttieCore
import SwiftUI

struct ScoreBubble: View {
    let score: ScoreValue
    let isVisible: Bool
    let reveal: () -> Void

    var body: some View {
        if isVisible {
            Text(score.displayValue)
                .font(.headline)
                .monospacedDigit()
                .accessibilityLabel("Score \(score.displayValue)")
        } else {
            Button("Reveal", action: reveal)
                .buttonStyle(.bordered)
                .controlSize(.small)
                .accessibilityLabel("Reveal score")
        }
    }
}
