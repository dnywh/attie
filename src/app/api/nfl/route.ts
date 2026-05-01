import { ballDontLieParams, errorMessage } from '@/utils/api/params';
import { getBallDontLieApi, paginationMeta } from '@/utils/api/ballDontLie';
import { generateDateRange } from '@/utils/dates';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const params = ballDontLieParams(searchParams);

    if (!params.ok) {
        return Response.json(
            { error: params.error },
            { status: 400 }
        );
    }

    const { dateFrom, dateTo, cursor } = params.value;

    // console.log(`[NFL API] Getting ${direction} games:`, {
    //     dateFrom,
    //     dateTo,
    //     cursor: cursor || 'No cursor (first page)'
    // });

    try {
        const datesArray = generateDateRange(dateFrom, dateTo);

        const response = await getBallDontLieApi().nfl.getGames({
            dates: datesArray,
            per_page: 25,
            ...(cursor && { cursor })
        });

        const meta = paginationMeta(response.meta);
        console.log(`[NFL API] Found ${response.data.length} games`, {
            next_cursor: meta.next_cursor,
            per_page: meta.per_page
        });

        return Response.json({
            matches: response.data,
            meta
        });
    } catch (error) {
        console.error('[NFL API] Error:', error);
        return Response.json(
            { error: 'Failed to fetch games', message: errorMessage(error) },
            { status: 500 }
        );
    }
}
