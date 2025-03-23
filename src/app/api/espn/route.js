import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';
// https://site.api.espn.com/apis/site/v2/sports/rugby/270557/scoreboard // United Rugby CHampionship
// https://site.api.espn.com/apis/site/v2/sports/rugby/242041/scoreboard // Super Rugby
// https://site.api.espn.com/apis/site/v2/sports/australian-football/afl/scoreboard // AFL
// https://site.api.espn.com/apis/site/v2/sports/rugby-league/3/scoreboard // NRL
// https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard
// https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard
// http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    // Get required parameters
    const dateFrom = searchParams.get('dateFrom').replace(/-/g, "");
    const dateTo = searchParams.get('dateTo').replace(/-/g, "");
    const direction = searchParams.get('direction');
    // Specific to ESPN
    const sport = searchParams.get('sport');
    const league = searchParams.get('league');
    const groups = searchParams.get('groups'); // Required for college basketball, both mens and womens
    const limit = searchParams.get('limit'); // Optional

    if (!dateFrom || !dateTo) {
        return NextResponse.json(
            { error: 'Missing required date parameters' },
            { status: 400 }
        );
    }

    console.log(`[ESPN API] Getting ${direction} games for sport: ${sport}, competition: ${league}`);

    const apiUrl = `${API_BASE_URL}/${sport}/${league}/scoreboard?dates=${dateFrom}-${dateTo}${groups ? `&groups=${groups}` : ''}&limit=${limit ? limit : 100}`
    console.log(`[ESPN API] URL: ${apiUrl}`)

    try {
        const response = await fetch(apiUrl);

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
                console.log(`[ESPN API] No content returned for sport: ${sport}, competition: ${league}`);
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
        console.log(`[ESPN API] Found ${matchCount} matches for sport: ${sport}, competition: ${league}`);

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
