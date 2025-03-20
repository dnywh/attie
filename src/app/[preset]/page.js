import FixturesClient from "@/components/FixturesClient";
import { PRESETS } from '@/constants/presets';

export async function generateStaticParams() {
    // Convert object keys to array of param objects
    return Object.keys(PRESETS).map((presetKey) => ({
        preset: presetKey
    }));
}

// This dynamic preset page approach is beneficial for a few reasons:
// 1. Allows for distinct, clean URLs for default states (e.g. attie.app/uk for UK-centric football)
// 2. Meaning they are easily shared
// 3. And most importantly, provide SEO-friendly pages for distinct searches (e.g. "NFL results without the scores")
export async function generateMetadata({ params }) {
    const preset = await PRESETS[params.preset];

    // TODO: can I just run `if (!preset) return` and have it fall back to the metadata from the main layout? If not, share that content somewhere higher, like in constants
    if (!preset) return {
        title: 'Attie: the anti-score scores app',
        description: 'Don’t spoil the game. Get the results without the scores.'
    };

    return {
        title: `Attie: ${preset.name} results without the scores`,
        description: `See who played ${preset.sport} overnight without spoiling the results. Attie shows recent ${preset.name} games with scores hidden by default.`,
        // Optional: Add OpenGraph metadata for better social sharing
        //   openGraph: {
        //     title: `Watch ${preset.name} without spoilers`,
        //     description: `Catch up on ${preset.name} matches without knowing the scores`,
        //   }
    };
}

export default async function PresetPage({ params }) {
    // Map preset URLs to actual sport and competition params
    const preset = await PRESETS[params.preset];
    // Return client accordingly
    // This return statement can be customised with a welcome banner or whatever
    // FixturesHeader in shared layout
    // If passing custom props to header, uncomment and set props:
    // <FixturesHeader />
    return <FixturesClient presetParams={preset} />
} 
