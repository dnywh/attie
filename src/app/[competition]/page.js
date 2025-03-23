import { redirect } from 'next/navigation';
import FixturesClient from "@/components/FixturesClient";
import { COMPETITIONS } from '@/constants/competitions';
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



    // TODO: can I just run `if (!selectedCompetition) return` and have it fall back to the metadata from the main layout? If not, share that content somewhere higher, like in constants
    if (!selectedCompetition) return {
        title: 'Attie: the anti-score scores app',
        description: 'Don’t spoil the game. Get the results without the scores.'
    };

    // Get local sport name so it flows more nicely
    const localSportName = SPORTS[selectedCompetition.sport].localName ? SPORTS[selectedCompetition.sport].localName : SPORTS[selectedCompetition.sport].name

    // TODO: This doesn't change if the user changes sports/competitions, is that okay?
    return {
        title: `Attie: ${selectedCompetition.name} results without the scores`,
        description: `See who played ${localSportName.toLowerCase()} overnight without spoiling the results. Attie shows recent ${selectedCompetition.name} games with scores hidden by default.`,
        // Optional: Add OpenGraph metadata for better social sharing
        //   openGraph: {
        //     title: `Watch ${selectedCompetition.name} without spoilers`,
        //     description: `Catch up on ${selectedCompetition.name} matches without knowing the scores`,
        //   }
    };
}

export default async function CompetitionPage({ params }) {
    const { competition } = await params;
    console.log('Selected competition:', competition);

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
        direction: false // Backwards by default
    }

    // Return client accordingly
    // This return statement can be customised with a welcome banner or whatever
    // FixturesHeader in shared layout
    // If passing custom props to header, uncomment and set props:
    // <FixturesHeader />
    return <FixturesClient initialParams={selectedCompetitionParams} />
} 
