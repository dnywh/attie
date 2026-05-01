# Attie

The anti-scores scores app, live at [attie.app](https://www.attie.app). Built on [Next.js](https://nextjs.org).

## Getting Started

This repo is a small monorepo:

- `apps/web` contains the Next.js app and Attie API facade.
- `apps/apple` contains the native SwiftUI app sources and `AttieCore` Swift package.
- `packages/contracts` contains shared fixture contracts and catalogue defaults.
- `packages/design-tokens` contains platform-neutral design tokens.

This project uses `npm` and is pinned to Node 24 LTS. If you use a Node version
manager, it should pick up `.node-version` automatically.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For the Apple package:

```bash
swift test --package-path apps/apple/Packages/AttieCore
```

Open `apps/apple/Attie.xcworkspace` in Xcode to work with the native sources.

## Maintenance

Use `npm audit`; `package-lock.json` is the source of truth for installed
dependency versions.

Useful local checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run audit
```

Before updating dependencies, run:

```bash
npm outdated
npm update
npm run check
npm run audit
```

The only package-manager override should be a small, documented security fix
for a transitive dependency that has not yet been refreshed upstream.

## Credits

The comic book illustration used on interstitials is public domain imagery. Specifically, it is from page 36 of _Sport Thrills_ issue 15, November 1951, uploaded by Mark Bowen to the [Digital Comic Museum](https://digitalcomicmuseum.com/index.php?dlid=35942).
