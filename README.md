# Attie

The anti-scores scores app, live at [attie.app](https://www.attie.app). Built on [Next.js](https://nextjs.org).

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

## Fixtures Cache

The app uses two types of caching for fixture data:

### Production

- In-memory cache lasts 5 minutes
- Clears on page refresh
- Reduces API calls during single-page session

### Development

- Same in-memory cache as production
- Additionally persists between page refreshes using localStorage
- Useful for rapid development without hitting API limits

To manually clear the development cache, open your browser's console and run:

```javascript
localStorage.removeItem("fixturesDevCache");
```
