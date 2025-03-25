import { BalldontlieAPI } from "@balldontlie/sdk";
import { APP_CONFIG } from '@/constants/config';
import { generateDateRange } from '@/utils/dates';

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

    // console.log(`[MLB API] Getting ${direction} games:`, {
    //     dateFrom,
    //     dateTo,
    //     cursor: cursor || 'No cursor (first page)'
    // });

    try {
        // Doesn't support date range, so make an array instead based on dateFrom and dateTo
        const datesArray = generateDateRange(dateFrom, dateTo);

        const response = await api.mlb.getGames({
            dates: datesArray,
            per_page: 25,
            ...(cursor && { cursor })
        });

        console.log(`[MLB API] Found ${response.data.length} games`, {
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
        console.error('[MLB API] Error:', error);
        return Response.json(
            { error: 'Failed to fetch games', message: error.message },
            { status: 500 }
        );
    }
}
