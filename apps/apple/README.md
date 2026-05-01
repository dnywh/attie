# Attie Apple

Native SwiftUI sources for Attie's iOS, macOS, and watchOS siblings.

The reusable product logic lives in `Packages/AttieCore`. The app sources under
`Apps/` are intentionally native SwiftUI and are organised so Xcode app targets
can share the same screens while adapting navigation and density per platform.

## Local Checks

```sh
swift test --package-path apps/apple/Packages/AttieCore
```

Open `Attie.xcworkspace` in Xcode to work with the Swift package and app source
folders together.
