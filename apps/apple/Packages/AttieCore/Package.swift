// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "AttieCore",
    defaultLocalization: "en",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
        .watchOS(.v10)
    ],
    products: [
        .library(
            name: "AttieCore",
            targets: ["AttieCore"]
        )
    ],
    targets: [
        .target(
            name: "AttieCore"
        ),
        .testTarget(
            name: "AttieCoreTests",
            dependencies: ["AttieCore"],
            resources: [
                .copy("Resources/common-fixtures.json")
            ]
        )
    ]
)
