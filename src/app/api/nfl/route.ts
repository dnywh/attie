import { ballDontLieParams, errorMessage } from "@/utils/api/params";
import {
  fetchBallDontLieGames,
  getBallDontLieApi,
} from "@/utils/api/ballDontLie";

const NFL_PER_PAGE = 25;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = ballDontLieParams(searchParams);

  if (!params.ok) {
    return Response.json({ error: params.error }, { status: 400 });
  }

  const { dateFrom, dateTo, cursor } = params.value;

  try {
    const api = getBallDontLieApi();
    const response = await fetchBallDontLieGames({
      cursor,
      dateFrom,
      dateTo,
      dateMode: "dates",
      getGames: api.nfl.getGames.bind(api.nfl),
      perPage: NFL_PER_PAGE,
    });

    return Response.json(response);
  } catch (error) {
    console.error("[NFL API] Error:", error);
    return Response.json(
      { error: "Failed to fetch games", message: errorMessage(error) },
      { status: 500 }
    );
  }
}
