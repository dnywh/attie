import { ballDontLieParams, errorMessage } from "@/utils/api/params";
import { getBallDontLieApi, paginationMeta } from "@/utils/api/ballDontLie";

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

    // console.log(`[NBA API] Getting ${direction} games:`, {
    //     dateFrom,
    //     dateTo,
    //     cursor: cursor || 'No cursor (first page)'
    // });

    try {
        const response = await getBallDontLieApi().nba.getGames({
            start_date: dateFrom,
            end_date: dateTo,
            per_page: 72, // 25–100, with 64 being the average in a week
            ...(cursor && { cursor })
        });

        const meta = paginationMeta(response.meta);
        console.log(`[NBA API] Found ${response.data.length} games`, {
            next_cursor: meta.next_cursor,
            per_page: meta.per_page
        });

        return Response.json({
            matches: response.data,
            meta
        });
    } catch (error) {
        console.error('[NBA API] Error:', error);
        return Response.json(
            { error: 'Failed to fetch games', message: errorMessage(error) },
            { status: 500 }
        );
    }
}
