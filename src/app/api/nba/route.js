import { BalldontlieAPI } from "@balldontlie/sdk";
import { APP_CONFIG } from '@/constants/config';

const api = new BalldontlieAPI({
    apiKey: process.env.BALL_DONT_LIE_API_KEY,
    headers: {
        'User-Agent': APP_CONFIG.USER_AGENT
    }
});

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const cursor = searchParams.get('cursor');
    const direction = searchParams.get('direction');

    console.log(`[NBA API] Getting ${direction} games:`, {
        dateFrom,
        dateTo,
        cursor: cursor || 'No cursor (first page)'
    });

    try {
        const response = await api.nba.getGames({
            start_date: dateFrom,
            end_date: dateTo,
            per_page: 72, // 25–100, with 64 being the average in a week
            ...(cursor && { cursor })
        });

        console.log(`[NBA API] Found ${response.data.length} games`, {
            next_cursor: response.meta.next_cursor,
            per_page: response.meta.per_page
        });


        // console.log(Response.json({ matches: response.data }));

        return Response.json({
            matches: response.data,
            meta: {
                next_cursor: response.meta.next_cursor,
                per_page: response.meta.per_page,
                has_more: !!response.meta.next_cursor
            }
        });
    } catch (error) {
        console.error('[NBA API] Error:', error);
        return Response.json(
            { error: 'Failed to fetch games', message: error.message },
            { status: 500 }
        );
    }
}
