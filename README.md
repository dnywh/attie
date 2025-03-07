# Attie

The (work-in-progress) anti-scores scores app, live at [attie.app](https://www.attie.app).

This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Fixtures Cache

During development, fixture data is cached in localStorage to reduce API calls. The cache:

- Persists for 5 minutes
- Only works in development mode
- Clears automatically on page refresh after expiry

To manually clear the cache, open your browser's developer console and run:

```javascript
localStorage.removeItem("fixturesDevCache");
```

The fixture data is also cached in production but not between page loads.
