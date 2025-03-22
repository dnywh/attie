import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/rugby/270557/scoreboard';

/**
 * Formats a date as YYYY-MM-DD for the API
 */
function formatDateForApi(date) {
    return date.toISOString().split('T')[0];
}

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);

    // Get required parameters
    const dateFrom = searchParams.get('dateFrom').replace(/-/g, "");
    const dateTo = searchParams.get('dateTo').replace(/-/g, "");
    const direction = searchParams.get('direction');

    if (!dateFrom || !dateTo) {
        return NextResponse.json(
            { error: 'Missing required date parameters' },
            { status: 400 }
        );
    }

    console.log(`[United Rugby Championship API] Getting ${direction} games for United Rugby Championship`);
    console.log(`[United Rugby Championship API] Date range: ${dateFrom} to ${dateTo}`);

    const fullUrl = `${API_BASE_URL}?dates=${dateFrom}-${dateTo}`
    console.log(fullUrl)
    try {
        const response = await fetch(
            fullUrl,
        );

        // Handle different response scenarios
        if (!response.ok) {
            if (response.status === 429) {
                console.log(`[United Rugby Championship API] Rate limit exceeded for United Rugby Championship`);
                return NextResponse.json(
                    { error: 'Rate limit exceeded', isRateLimit: true },
                    { status: 429 }
                );
            }

            if (response.status === 204) {
                console.log(`[United Rugby Championship API] No content returned for United Rugby Championship`);
                return NextResponse.json({ matches: [], message: 'No matches found' });
            }

            console.log(`[United Rugby Championship API] Error ${response.status} for United Rugby Championship`);
            return NextResponse.json(
                { error: `API error: ${response.status}`, message: 'API request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const matchCount = data.events?.length || 0;
        console.log(`[United Rugby Championship API] Found ${matchCount} matches for United Rugby Championship`);

        return NextResponse.json({
            ...data,
            meta: {
                matchCount,
                dateFrom,
                dateTo,
                direction
            }
        });
    } catch (error) {
        console.error('[United Rugby Championship API] Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch fixtures', message: error.message },
            { status: 500 }
        );
    }
}
