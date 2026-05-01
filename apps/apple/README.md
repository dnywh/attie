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

These sources are native SwiftUI. The shared logic is already in the
`AttieCore` Swift package; the app files live under `Apps/Attie/Shared`.

1. Open `apps/apple/Attie.xcworkspace` in Xcode.
2. If Xcode does not already show an iOS app target, create one with
   **File > New > Target... > iOS > App**.
3. Name the target `Attie`, choose **SwiftUI** for the interface, choose
   **Swift** for the language, and add it to the existing workspace.
4. In the target's **Build Phases > Compile Sources**, add the Swift files from
   `Apps/Attie/Shared`.
5. In the target's **Frameworks, Libraries, and Embedded Content**, add the
   local `AttieCore` package product.
6. In **Signing & Capabilities**, select your personal or team Apple Developer
   account and set a unique bundle identifier, for example
   `net.dannywhite.attie`.
7. Connect your iPhone with a cable, or use an already-paired wireless device,
   then select it from Xcode's run destination menu.
8. Press **Run**. If iOS asks whether to trust the developer app, approve it in
   **Settings > General > VPN & Device Management** on the phone.

For a personal Apple Developer account, the installed development build may
expire and need to be re-run from Xcode periodically.
