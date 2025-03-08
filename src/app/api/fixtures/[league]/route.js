import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { league } = await params;

    // Use UTC dates for API query since API works in UTC
    const now = new Date();
    const today = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    )).toISOString().split('T')[0];

    const startDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 7
    ));
    const formattedStartDate = startDate.toISOString().split('T')[0];

    console.log(`Getting games scheduled from today UTC (${today}), back 7 days to ${formattedStartDate}`);

    try {
        const response = await fetch(
            `https://api.football-data.org/v4/competitions/${league}/matches?dateFrom=${formattedStartDate}&dateTo=${today}`,
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
