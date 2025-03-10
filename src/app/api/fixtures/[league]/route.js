import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { league } = await params;
    const now = new Date();

    // Get dates for -7 to +7 days window
    const pastDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 7
    )).toISOString().split('T')[0];

    const futureDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 7
    )).toISOString().split('T')[0];

    console.log(`Getting games scheduled from ${pastDate} to ${futureDate}`);

    try {
        const response = await fetch(
            `https://api.football-data.org/v4/competitions/${league}/matches?dateFrom=${pastDate}&dateTo=${futureDate}`,
            {
                headers: {
                    "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
                },
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
    }
}
