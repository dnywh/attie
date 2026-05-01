import Foundation
import Testing
@testable import AttieCore

@Suite("Attie API client", .serialized)
struct AttieAPIClientTests {
    @Test("builds facade requests and decodes responses")
    func buildsFacadeRequestsAndDecodesResponses() async throws {
        let payload = """
        {
          "fixtures": [],
          "meta": {
            "next_cursor": 123,
            "per_page": 25,
            "has_more": true,
            "count": 0,
            "dateFrom": "2026-05-01",
            "dateTo": "2026-05-02",
            "direction": "future",
            "competitions": ["nba"]
          }
        }
        """.data(using: .utf8)!
        let session = URLSession.mocking(statusCode: 200, data: payload)
        let client = AttieAPIClient(
            baseURL: URL(string: "https://attie.test")!,
            urlSession: session
        )
        let response = try await client.fetchFixtures(
            competitions: [.nba],
            dateRange: FixtureDateRange(dateFrom: "2026-05-01", dateTo: "2026-05-02"),
            direction: .forwards,
            cursor: 123
        )
        let url = try #require(MockURLProtocol.lastRequest?.url)
        let components = try #require(URLComponents(url: url, resolvingAgainstBaseURL: false))
        let queryItems = components.queryItems ?? []

        #expect(url.path == "/api/fixtures")
        #expect(queryItems.contains(URLQueryItem(name: "competition", value: "nba")))
        #expect(queryItems.contains(URLQueryItem(name: "direction", value: "future")))
        #expect(queryItems.contains(URLQueryItem(name: "cursor", value: "123")))
        #expect(response.meta.nextCursor == 123)
        #expect(response.meta.direction == .future)
    }

    @Test("maps rate limits")
    func mapsRateLimits() async throws {
        let session = URLSession.mocking(statusCode: 429, data: Data())
        let client = AttieAPIClient(
            baseURL: URL(string: "https://attie.test")!,
            urlSession: session
        )

        await #expect(throws: AttieAPIError.rateLimited) {
            _ = try await client.fetchFixtures(
                competitions: [.nba],
                dateRange: FixtureDateRange(dateFrom: "2026-05-01", dateTo: "2026-05-02"),
                direction: .backwards
            )
        }
    }
}

final class MockURLProtocol: URLProtocol, @unchecked Sendable {
    nonisolated(unsafe) static var response: HTTPURLResponse?
    nonisolated(unsafe) static var data = Data()
    nonisolated(unsafe) static var lastRequest: URLRequest?

    override class func canInit(with request: URLRequest) -> Bool {
        true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        request
    }

    override func startLoading() {
        Self.lastRequest = request

        if let response = Self.response {
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        }

        client?.urlProtocol(self, didLoad: Self.data)
        client?.urlProtocolDidFinishLoading(self)
    }

    override func stopLoading() {}
}

private extension URLSession {
    static func mocking(statusCode: Int, data: Data) -> URLSession {
        let configuration = URLSessionConfiguration.ephemeral

        configuration.protocolClasses = [MockURLProtocol.self]
        MockURLProtocol.data = data
        MockURLProtocol.lastRequest = nil
        MockURLProtocol.response = HTTPURLResponse(
            url: URL(string: "https://attie.test")!,
            statusCode: statusCode,
            httpVersion: nil,
            headerFields: nil
        )

        return URLSession(configuration: configuration)
    }
}
