import FixturesClient from "@/components/FixturesClient";

export async function generateStaticParams() {
    return [
        { preset: 'nba' },
        { preset: 'nfl' },
        { preset: 'mlb' },
        { preset: 'uk' },
        { preset: 'eurosnob' },
    ]
}

// This dynamic preset page approach is beneficial for a few reasons:
// 1. Allows for distinct, clean URLs for default states (e.g. attie.app/uk for UK-centric football)
// 2. Meaning they are easily shared
// 3. And most importantly, provide SEO-friendly pages for distinct searches (e.g. "NFL results without the scores")
export const metadata = {
    title: `Unique page title here, dynamically fetched from preset title. For example: Attie: MLB results without the scores`,
    description: 'Again, with the SEO description pertaining specifically to the preset. For example: Don’t spoil your baseball highlights. Get the MLB results without the scores."',
}

export default function PresetPage({ params }) {
    // Map preset URLs to actual sport and competition params
    const presetMapping = {
        'nba': { sport: 'basketball', competitions: ['nba'] },
        'nfl': { sport: 'americanFootball', competitions: ['nfl'] },
        'mlb': { sport: 'baseball', competitions: ['mlb'] },
        'uk': { sport: 'football', competitions: ['premier-league', 'championship'] },
        'eurosnob': { sport: 'football', competitions: ['premier-league', 'champions-league'] },
    }
    // Return client accordingly
    // This return statement can be customised with a welcome banner or whatever
    return <FixturesClient defaultParams={presetMapping[params.preset]} />
} 
