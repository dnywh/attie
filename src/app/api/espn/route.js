import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';
// https://site.api.espn.com/apis/site/v2/sports/rugby/270557/scoreboard // United Rugby CHampionship
// https://site.api.espn.com/apis/site/v2/sports/rugby/242041/scoreboard // Super Rugby
// https://site.api.espn.com/apis/site/v2/sports/australian-football/afl/scoreboard // AFL
// https://site.api.espn.com/apis/site/v2/sports/rugby-league/3/scoreboard // NRL

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Get required parameters
    const dateFrom = searchParams.get('dateFrom').replace(/-/g, "");
    const dateTo = searchParams.get('dateTo').replace(/-/g, "");
    const direction = searchParams.get('direction');
    // Specific to ESPN
    const sport = searchParams.get('sport');
    const league = searchParams.get('league');

    if (!dateFrom || !dateTo) {
        return NextResponse.json(
            { error: 'Missing required date parameters' },
            { status: 400 }
        );
    }

    console.log(`[ESPN API] Getting ${direction} games for ${sport}, ${league}`);
    console.log(`[ESPN API] Date range: ${dateFrom} to ${dateTo}`);

    try {
        const response = await fetch(
            `${API_BASE_URL}/${sport}/${league}/scoreboard?dates=${dateFrom}-${dateTo}`
        );

        // Handle different response scenarios
        if (!response.ok) {
            if (response.status === 429) {
                console.log(`[ESPN API] Rate limit exceeded`);
                return NextResponse.json(
                    { error: 'Rate limit exceeded', isRateLimit: true },
                    { status: 429 }
                );
            }

            if (response.status === 204) {
                console.log(`[ESPN API] No content returned for ${sport}, ${league}`);
                return NextResponse.json({ matches: [], message: 'No matches found' });
            }

            console.log(`[ESPN API] Error ${response.status}`);
            return NextResponse.json(
                { error: `API error: ${response.status}`, message: 'API request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const matchCount = data.events?.length || 0;
        console.log(`[ESPN API] Found ${matchCount} matches for ${sport}, ${league}`);

        return NextResponse.json({
            events: data.events || [],
            meta: {
                matchCount,
                dateFrom,
                dateTo,
                direction
            }
        });
    } catch (error) {
        console.error('[ESPN API] Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch fixtures', message: error.message },
            { status: 500 }
        );
    }
}
