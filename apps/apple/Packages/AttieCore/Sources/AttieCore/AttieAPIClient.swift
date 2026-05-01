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
        cursor: Int? = nil
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

        if let cursor {
            queryItems.append(URLQueryItem(name: "cursor", value: String(cursor)))
        }

        components?.queryItems = queryItems

        guard let url = components?.url else {
            throw AttieAPIError.invalidURL
        }

        let (data, response) = try await urlSession.data(from: url)
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
