import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import FixturesClient from "@/components/FixturesClient";
import { COMPETITIONS } from '@/constants/competitions';
import { siteConfig } from "@/config/site";
import { SPORTS } from "@/config/sportConfig"

export async function generateStaticParams() {
    // Convert object keys to array of param objects
    return Object.keys(COMPETITIONS).map((competitionKey) => ({
        competition: competitionKey
    }));
}

// This dynamic competition page approach is beneficial for a few reasons:
// 1. Allows for distinct, clean URLs for each competition across all sports (e.g. attie.app/eredivisie for Dutch football)
// 2. Meaning they are easily shareable
// 3. And most importantly, provide SEO-friendly pages for distinct searches (e.g. "NFL results without the scores")
export async function generateMetadata({ params }) {
    const { competition } = await params;
    const selectedCompetition = COMPETITIONS[competition];

    // Get local sport name so it flows more nicely
    const selectedSport = SPORTS[selectedCompetition.sport].localName ? SPORTS[selectedCompetition.sport].localName : SPORTS[selectedCompetition.sport].name

    const pageTitle = `Attie: ${selectedCompetition.name} results without the scores`
    const pageDescription = `See who played ${selectedSport.toLowerCase()} recently without spoiling the results. Attie shows ${selectedCompetition.name} games with scores hidden by default.`

    // TODO: This doesn't change if the user changes sports/competitions, is that okay?
    return {
        title: pageTitle,
        description: pageDescription,
        keywords: [
            ...siteConfig.meta.keywords,
            `${selectedCompetition.name} results`,
            `${selectedSport} results`,
        ],
        openGraph: {
            title: pageTitle,
            type: "website",
            description: pageDescription,
            siteName: siteConfig.name,
            url: `${siteConfig.url}/${Object.keys(COMPETITIONS).find(key => COMPETITIONS[key] === selectedCompetition)}`,
            // TODO: The `opengraph-image` does not get passed down automatically, presumedly because this counts as a separate route segment
        },
    };
};


export default async function CompetitionPage({ params }) {
    const { competition } = await params;
    // The dynamic generation of pages meanings that going to a non-existant slug will crash this React app once it tries to find its corresponding competition details
    // We therefore should check if the passed path matches a competition before continuing
    // Check if the page slug exists as a competition in COMPETITIONS
    if (!COMPETITIONS[competition]) {
        console.log(`Invalid competition requested: ${competition}`);
        redirect('/');
    }

    // If we get here, the competition exists
    // Map competition URLs to actual sport and competition params
    const selectedCompetitionParams = {
        competitions: [competition],// Just the key, nested in in an array since initialParams expects that format
        sport: COMPETITIONS[competition].sport,
    }

    // Return client accordingly
    // This return statement can be customised with a welcome banner or whatever
    // FixturesHeader in shared layout
    // If passing custom props to header, uncomment and set props:
    // <FixturesHeader />
    return (
        <Suspense>
            {/* Fallback (i.e. loading) is handled inside FixturesClient */}
            <FixturesClient initialParams={selectedCompetitionParams} />
        </Suspense>
    );
} 
