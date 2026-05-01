import Foundation

public struct FixtureDateWindow: Equatable, Sendable {
    public var fromOffset: Int
    public var toOffset: Int

    public init(fromOffset: Int, toOffset: Int) {
        self.fromOffset = fromOffset
        self.toOffset = toOffset
    }
}

public struct FixtureDateRange: Equatable, Sendable {
    public var dateFrom: String
    public var dateTo: String

    public init(dateFrom: String, dateTo: String) {
        self.dateFrom = dateFrom
        self.dateTo = dateTo
    }
}

public enum FixtureWindows {
    public static let initialPastDays = 7
    public static let initialFutureDays = 28
    public static let incrementDays = 14
    public static let maximumAttempts = 4

    public static func initialWindow(direction: Direction) -> FixtureDateWindow {
        switch direction {
        case .forwards:
            FixtureDateWindow(fromOffset: 0, toOffset: initialFutureDays)
        case .backwards:
            FixtureDateWindow(fromOffset: -initialPastDays, toOffset: 0)
        }
    }

    public static func nextWindow(
        after currentWindow: FixtureDateWindow,
        direction: Direction,
        days: Int = incrementDays
    ) -> FixtureDateWindow {
        switch direction {
        case .forwards:
            FixtureDateWindow(
                fromOffset: currentWindow.toOffset + 1,
                toOffset: currentWindow.toOffset + days
            )
        case .backwards:
            FixtureDateWindow(
                fromOffset: currentWindow.fromOffset - days,
                toOffset: currentWindow.fromOffset - 1
            )
        }
    }

    public static func dateRange(
        for window: FixtureDateWindow,
        today: Date = Date(),
        calendar inputCalendar: Calendar = .current
    ) -> FixtureDateRange {
        let calendar = inputCalendar
        let startOfToday = calendar.startOfDay(for: today)
        let fromDate = calendar.date(byAdding: .day, value: window.fromOffset, to: startOfToday) ?? startOfToday
        let toDate = calendar.date(byAdding: .day, value: window.toOffset, to: startOfToday) ?? startOfToday
        let formatter = DateFormatter()

        formatter.calendar = calendar
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"

        return FixtureDateRange(
            dateFrom: formatter.string(from: fromDate),
            dateTo: formatter.string(from: toDate)
        )
    }
}
