import AttieCore
import SwiftUI

struct ScoreBubble: View {
    let score: ScoreValue
    let isVisible: Bool
    let reveal: () -> Void

    var body: some View {
        Button(action: reveal) {
            ZStack {
                Circle()
                    .fill(isVisible ? .clear : .primary)
                    .overlay {
                        Circle()
                            .strokeBorder(.primary, style: StrokeStyle(lineWidth: isVisible ? 0.5 : 0))
                    }

                if isVisible {
                    Text(score.displayValue)
                        .font(.headline)
                        .foregroundStyle(.primary)
                }
            }
            .frame(width: 34, height: 34)
        }
        .buttonStyle(.plain)
        .disabled(isVisible)
        .accessibilityLabel(isVisible ? "Score \(score.displayValue)" : "Reveal score")
    }
}
