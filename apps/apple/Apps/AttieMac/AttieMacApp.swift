import SwiftUI

@main
struct AttieMacApp: App {
    var body: some Scene {
        WindowGroup {
            FixturesView()
                .frame(minWidth: 420, idealWidth: 520, minHeight: 640)
        }
    }
}
