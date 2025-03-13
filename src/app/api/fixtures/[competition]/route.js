import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { competition: competitionCode } = await params;
    const { searchParams } = new URL(request.url);
    const now = new Date();

    // Default to looking 28 days ahead for future fixtures, 7 days back for past
    const isLookingForward = searchParams.get('direction') === 'future';
    const defaultWindow = isLookingForward ? 28 : 7;

    const dateFrom = searchParams.get('dateFrom') || new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - (isLookingForward ? 0 : defaultWindow)
    )).toISOString().split('T')[0];

    const dateTo = searchParams.get('dateTo') || new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + (isLookingForward ? defaultWindow : 0)
    )).toISOString().split('T')[0];

    console.log(`Getting ${isLookingForward ? 'future' : 'past'} games scheduled from ${dateFrom} to ${dateTo} for ${competitionCode}`);

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
            // Special handling for rate limit and no content
            if (response.status === 429) {
                return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            }
            if (response.status === 204) {
                return NextResponse.json({ matches: [] });
            }
            return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
    }
}
