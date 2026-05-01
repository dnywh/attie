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

## Run on iPhone

These sources are native SwiftUI. The installable iOS app target is `Attie`;
the reusable package target is `AttieCore`.

1. Open `apps/apple/Attie.xcworkspace` in Xcode.
2. Use the scheme picker in Xcode's toolbar to choose **Attie**, not
   **AttieCore**.
3. In the same toolbar, choose your connected iPhone as the run destination.
   The toolbar should read something like **Attie > Danny's iPhone**.
4. Select the `Attie` project in the Project Navigator, then select the
   `Attie` target.
5. In **Signing & Capabilities**, select your personal or team Apple Developer
   account. If Xcode reports that the bundle identifier is already taken,
   change it to something unique, for example `net.dannywhite.attie.dev`.
6. Press **Run**. Building `AttieCore` can succeed, but it will not install or
   launch an app. Running the `Attie` scheme should install Attie on the phone.
7. If iOS asks whether to trust the developer app, approve it in
   **Settings > General > VPN & Device Management** on the phone.

For a personal Apple Developer account, the installed development build may
expire and need to be re-run from Xcode periodically.
