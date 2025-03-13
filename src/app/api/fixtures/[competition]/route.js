import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { competition: competitionCode } = await params;
    const { searchParams } = new URL(request.url);
    const now = new Date();

    // Default windows - 28 days forward, 7 days back
    const isLookingForward = searchParams.get('direction') === 'future';
    const defaultWindow = isLookingForward ? 28 : 7;

    // Ensure we await these params
    const dateFrom = await Promise.resolve(searchParams.get('dateFrom')) || new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - (isLookingForward ? 0 : defaultWindow)
    )).toISOString().split('T')[0];

    const dateTo = await Promise.resolve(searchParams.get('dateTo')) || new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + (isLookingForward ? defaultWindow : 0)
    )).toISOString().split('T')[0];

    console.log(`[API] Getting ${isLookingForward ? 'future' : 'past'} games scheduled from ${dateFrom} to ${dateTo} for ${competitionCode}`);

    try {
        const response = await fetch(
            `https://api.football-data.org/v4/competitions/${competitionCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
            {
                headers: {
                    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 429) {
                console.log(`[API] Rate limit exceeded for ${competitionCode}`);
                return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            }
            if (response.status === 204) {
                console.log(`[API] No content returned for ${competitionCode}`);
                return NextResponse.json({ matches: [] });
            }
            console.log(`[API] Error ${response.status} for ${competitionCode}`);
            return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        console.log(`[API] Found ${data.matches?.length || 0} matches for ${competitionCode}`);
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API] Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
    }
}
