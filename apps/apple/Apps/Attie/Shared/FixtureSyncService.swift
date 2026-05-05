import AttieCore
import Foundation
#if os(iOS) || os(watchOS)
import WatchConnectivity
#endif

@MainActor
final class FixtureSyncService: NSObject, ObservableObject {
    static let shared = FixtureSyncService()

    @Published private(set) var latestSnapshot: WatchFixtureSnapshot?

    private let cache: WatchFixtureSnapshotCache

    #if os(iOS) || os(watchOS)
    private let session: WCSession?
    #endif

    init(cache: WatchFixtureSnapshotCache = WatchFixtureSnapshotCache()) {
        self.cache = cache
        self.latestSnapshot = cache.load()

        #if os(iOS) || os(watchOS)
        self.session = WCSession.isSupported() ? WCSession.default : nil
        #endif

        super.init()

        #if os(iOS) || os(watchOS)
        session?.delegate = self
        session?.activate()
        #endif
    }

    func publish(_ snapshot: WatchFixtureSnapshot) {
        latestSnapshot = snapshot
        cache.save(snapshot)

        #if os(iOS)
        guard let session else {
            return
        }

        sendApplicationContext(snapshot, session: session)

        if session.isWatchAppInstalled, let data = encodedSnapshot(snapshot) {
            session.transferUserInfo(["snapshot": data])
        }
        #endif
    }

    func updateFromRemote(_ snapshot: WatchFixtureSnapshot) {
        latestSnapshot = snapshot
        cache.save(snapshot)
    }

    nonisolated private func decodedSnapshot(from payload: [String: Any]) -> WatchFixtureSnapshot? {
        guard let data = payload["snapshot"] as? Data else {
            return nil
        }

        return try? JSONDecoder().decode(WatchFixtureSnapshot.self, from: data)
    }

    private func encodedSnapshot(_ snapshot: WatchFixtureSnapshot) -> Data? {
        try? JSONEncoder().encode(snapshot)
    }

    #if os(iOS)
    private func sendApplicationContext(_ snapshot: WatchFixtureSnapshot, session: WCSession) {
        guard let data = encodedSnapshot(snapshot) else {
            return
        }

        try? session.updateApplicationContext(["snapshot": data])
    }
    #endif
}

#if os(iOS) || os(watchOS)
extension FixtureSyncService: WCSessionDelegate {
    nonisolated func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {}

    #if os(iOS)
    nonisolated func sessionDidBecomeInactive(_ session: WCSession) {}

    nonisolated func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
    #endif

    nonisolated func session(
        _ session: WCSession,
        didReceiveApplicationContext applicationContext: [String: Any]
    ) {
        guard let snapshot = decodedSnapshot(from: applicationContext) else {
            return
        }

        Task { @MainActor in
            updateFromRemote(snapshot)
        }
    }

    nonisolated func session(
        _ session: WCSession,
        didReceiveUserInfo userInfo: [String: Any] = [:]
    ) {
        guard let snapshot = decodedSnapshot(from: userInfo) else {
            return
        }

        Task { @MainActor in
            updateFromRemote(snapshot)
        }
    }
}
#endif
