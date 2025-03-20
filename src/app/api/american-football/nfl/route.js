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
    const dateA = searchParams.get('dateFrom');
    const dateB = searchParams.get('dateTo');
    const cursor = searchParams.get('cursor');
    const direction = searchParams.get('direction');

    console.log(`[NFL API] Getting ${direction} games:`, {
        dateA,
        dateB,
        cursor: cursor || 'No cursor (first page)'
    });

    try {
        const response = await api.nfl.getGames({
            // Doesn't support date range, so use an array instead. E.g: ?dates[]=2024-01-01&dates[]=2024-01-02
            dates: ["2023-12-31", "2024-01-01"], // dates: [dateA, dateB] etc
            per_page: 25, // 25–100
            ...(cursor && { cursor })
        });

        console.log(`[NFL API] Found ${response.data.length} games`, {
            next_cursor: response.meta.next_cursor,
            per_page: response.meta.per_page
        });

        return Response.json({
            matches: response.data,
            meta: {
                next_cursor: response.meta.next_cursor,
                per_page: response.meta.per_page,
                has_more: !!response.meta.next_cursor
            }
        });
    } catch (error) {
        console.error('[NFL API] Error:', error);
        return Response.json(
            { error: 'Failed to fetch games', message: error.message },
            { status: 500 }
        );
    }
}
