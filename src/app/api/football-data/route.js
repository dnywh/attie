import { NextResponse } from 'next/server';
import { APP_CONFIG } from '@/constants/config';

const API_BASE_URL = 'https://api.football-data.org/v4';

/**
 * Formats a date as YYYY-MM-DD for the API
 */
// function formatDateForApi(date) {
//     return date.toISOString().split('T')[0];
// }

export async function GET(request, { params }) {
    const { searchParams } = new URL(request.url);

    // Get required parameters
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const direction = searchParams.get('direction');
    // Custom to football-data
    const competitionCode = searchParams.get('competition');

    if (!dateFrom || !dateTo) {
        return NextResponse.json(
            { error: 'Missing required date parameters' },
            { status: 400 }
        );
    }

    console.log(`[API] Getting ${direction} games for ${competitionCode}`);
    console.log(`[API] Date range: ${dateFrom} to ${dateTo}`);

    try {
        const response = await fetch(
            `${API_BASE_URL}/competitions/${competitionCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            {
                headers: {
                    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
                    "User-Agent": APP_CONFIG.USER_AGENT,
                },
            }
        );

        // Handle different response scenarios
        if (!response.ok) {
            if (response.status === 429) {
                console.log(`[API] Rate limit exceeded for ${competitionCode}`);
                return NextResponse.json(
                    { error: 'Rate limit exceeded', isRateLimit: true },
                    { status: 429 }
                );
            }

            if (response.status === 204) {
                console.log(`[API] No content returned for ${competitionCode}`);
                return NextResponse.json({ matches: [], message: 'No matches found' });
            }

            console.log(`[API] Error ${response.status} for ${competitionCode}`);
            return NextResponse.json(
                { error: `API error: ${response.status}`, message: 'API request failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const matchCount = data.matches?.length || 0;
        console.log(`[API] Found ${matchCount} matches for ${competitionCode}`);

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
        console.error('[API] Fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch fixtures', message: error.message },
            { status: 500 }
        );
    }
}
