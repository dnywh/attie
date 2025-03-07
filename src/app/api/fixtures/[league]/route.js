import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { league } = await params;
    const { searchParams } = new URL(request.url);

    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    const dateRange = 14 // How many days back to go
    startDate.setDate(startDate.getDate() - dateRange);
    const formattedStartDate = startDate.toISOString().split('T')[0];

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
