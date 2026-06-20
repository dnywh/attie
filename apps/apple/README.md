# Attie Apple

Native SwiftUI sources for Attie's iOS, macOS, and watchOS siblings.

The reusable product logic lives in `Packages/AttieCore`. The app sources under
`Apps/` are intentionally native SwiftUI and are organised so Xcode app targets
can share the same screens while adapting navigation and density per platform.

## Local checks

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

## Recover an expired iPhone build

If the installed development build has expired, run the `Attie` scheme again
from Xcode. The scheme embeds `AttieWatch`, so a phone build can still fail while
signing the watch target.

1. Open `apps/apple/Attie.xcworkspace`, not the `.xcodeproj`.
2. Select **Attie > Danny's iPhone** in the toolbar.
3. In **Signing & Capabilities**, check both targets:
   - `Attie`: `net.dannywhite.attie.dev`
   - `AttieWatch`: `net.dannywhite.attie.dev.watchkitapp`
4. In **Build Settings** for `AttieWatch`, check that
   `WKCompanionAppBundleIdentifier` resolves to `net.dannywhite.attie.dev`.
5. Press **Run**.

If `AttieWatch` still fails to sign, refresh profiles through Xcode instead of
deleting files manually:

1. Open **Xcode > Settings > Accounts**.
2. Select **Danny White**.
3. Choose **Download Manual Profiles**.
4. Choose **Product > Clean Build Folder**.
5. Run the `Attie` scheme again.

If the expanded `CodeSign` log says `resource fork, Finder information, or
similar detritus not allowed`, **Clean Build Folder** is the important step.
That clears stale build output for this project without touching provisioning
profiles.

To inspect Xcode's resolved identifiers:

```sh
xcodebuild -showBuildSettings \
  -workspace apps/apple/Attie.xcworkspace \
  -scheme AttieWatch \
  -configuration Debug \
  -destination 'generic/platform=watchOS' \
  | rg 'TARGET_NAME|PRODUCT_BUNDLE_IDENTIFIER|ATTIE_IOS_BUNDLE_IDENTIFIER|DEVELOPMENT_TEAM|INFOPLIST_KEY_WKCompanion'
```

## Xcode recommended settings

Xcode may ask to update the project to its recommended settings. These changes
are expected:

- **Asset catalog enable generated asset symbol extensions**: sets
  `ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS = YES`.
- **Build settings inherit development team from project settings**: moves
  `DEVELOPMENT_TEAM` from individual targets to the project build settings.
- **Localisation string catalog symbol generation**: sets
  `STRING_CATALOG_GENERATE_SYMBOLS = YES`.

The `Watch7,18` asset-catalog error usually means the installed Xcode does not
recognise the paired Apple Watch model or watchOS version. Update Xcode, reopen
the workspace, reconnect the phone, and wait for Xcode to finish preparing
device support before running again.
