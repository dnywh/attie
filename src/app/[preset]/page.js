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

    if (!preset) return {
        title: 'Attie: Sports results without spoilers',
        description: 'Watch delayed sports matches without knowing the score.'
    };

    return {
        title: `Attie: ${preset.name} without the scores`,
        description: `Don't spoil your ${preset.sport} highlights. Get the ${preset.name} results without knowing the scores.`,
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
    return <FixturesClient presetParams={preset} />
} 
