import { BalldontlieAPI } from "@balldontlie/sdk";

const api = new BalldontlieAPI({
    apiKey: process.env.BALL_DONT_LIE_API_KEY
});

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const dateA = searchParams.get('dateFrom');
    const dateB = searchParams.get('dateTo');
    const cursor = searchParams.get('cursor');
    const direction = searchParams.get('direction');

    console.log(`[MLB API] Getting ${direction} games:`, {
        dateA,
        dateB,
        cursor: cursor || 'No cursor (first page)'
    });

    try {
        const response = await api.mlb.getGames({
            // Doesn't support date range, so use an array instead. E.g: ?dates[]=2024-01-01&dates[]=2024-01-02
            dates: ["2024-09-01", "2024-09-10", "2024-09-11"], // dates: [dateA, dateB] etc
            per_page: 25, // 25–100
            ...(cursor && { cursor })
        });

        console.log(`[MLB API] Found ${response.data.length} games`, {
            next_cursor: response.meta.next_cursor,
            per_page: response.meta.per_page
        });

        console.log(Response.json({ matches: response.data }));

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
