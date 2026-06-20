import Foundation

public enum AttieAPIError: Error, Equatable, Sendable {
    case invalidURL
    case rateLimited
    case server(statusCode: Int)
}

public struct AttieAPIClient: @unchecked Sendable {
    public var baseURL: URL
    public var urlSession: URLSession

    public init(
        baseURL: URL = URL(string: "https://www.attie.app")!,
        urlSession: URLSession = .shared
    ) {
        self.baseURL = baseURL
        self.urlSession = urlSession
    }

    public func fetchFixtures(
        competitions: [CompetitionKey],
        dateRange: FixtureDateRange,
        direction: Direction,
        cursor: Int? = nil,
        refreshToken: String? = nil
    ) async throws -> FixtureListResponse {
        guard cursor == nil || competitions.count == 1 else {
            throw AttieAPIError.invalidURL
        }

        var components = URLComponents(
            url: baseURL.appending(path: "/api/fixtures"),
            resolvingAgainstBaseURL: false
        )
        var queryItems = competitions.map {
            URLQueryItem(name: "competition", value: $0.rawValue)
        }

        queryItems.append(URLQueryItem(name: "dateFrom", value: dateRange.dateFrom))
        queryItems.append(URLQueryItem(name: "dateTo", value: dateRange.dateTo))
        queryItems.append(URLQueryItem(name: "direction", value: direction.apiDirection.rawValue))
        queryItems.append(URLQueryItem(name: "timeZone", value: TimeZone.current.identifier))

        if let cursor {
            queryItems.append(URLQueryItem(name: "cursor", value: String(cursor)))
        }

        if let refreshToken {
            queryItems.append(URLQueryItem(name: "_refresh", value: refreshToken))
        }

        components?.queryItems = queryItems

        guard let url = components?.url else {
            throw AttieAPIError.invalidURL
        }

        var request = URLRequest(
            url: url,
            cachePolicy: .reloadIgnoringLocalAndRemoteCacheData
        )
        request.setValue("no-cache", forHTTPHeaderField: "Cache-Control")
        request.setValue("no-cache", forHTTPHeaderField: "Pragma")

        let (data, response) = try await urlSession.data(for: request)
        let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 200

        if statusCode == 429 {
            throw AttieAPIError.rateLimited
        }

        guard (200..<300).contains(statusCode) else {
            throw AttieAPIError.server(statusCode: statusCode)
        }

        return try JSONDecoder().decode(FixtureListResponse.self, from: data)
    }
}
