import { ballDontLieParams, errorMessage } from "@/utils/api/params";
import {
  fetchBallDontLieGames,
  getBallDontLieApi,
} from "@/utils/api/ballDontLie";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NBA_PER_PAGE = 72; // 25-100, with 64 being the average in a week
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = ballDontLieParams(searchParams);

  if (!params.ok) {
    return Response.json(
      { error: params.error },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const { dateFrom, dateTo, cursor } = params.value;

  try {
    const api = getBallDontLieApi();
    const response = await fetchBallDontLieGames({
      cursor,
      dateFrom,
      dateTo,
      dateMode: "range",
      getGames: api.nba.getGames.bind(api.nba),
      perPage: NBA_PER_PAGE,
    });

    return Response.json(response, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("[NBA API] Error:", error);
    return Response.json(
      { error: "Failed to fetch games", message: errorMessage(error) },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
