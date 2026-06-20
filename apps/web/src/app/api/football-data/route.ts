import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/constants/config";
import { errorMessage, footballDataParams } from "@/utils/api/params";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const API_BASE_URL = "https://api.football-data.org/v4";
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = footballDataParams(searchParams);

  if (!params.ok) {
    return NextResponse.json(
      { error: params.error },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const { dateFrom, dateTo, direction, competitionCode } = params.value;

  try {
    const response = await fetch(
      `${API_BASE_URL}/competitions/${competitionCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        cache: "no-store",
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "",
          "User-Agent": APP_CONFIG.USER_AGENT,
        },
      }
    );

    if (response.status === 204) {
      return NextResponse.json(
        { matches: [], message: "No matches found" },
        { headers: NO_STORE_HEADERS }
      );
    }

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded", isRateLimit: true },
          { status: 429, headers: NO_STORE_HEADERS }
        );
      }

      return NextResponse.json(
        { error: `API error: ${response.status}`, message: "API request failed" },
        { status: response.status, headers: NO_STORE_HEADERS }
      );
    }

    const data = await response.json();
    const matchCount = data.matches?.length || 0;

    return NextResponse.json(
      {
        ...data,
        meta: {
          matchCount,
          dateFrom,
          dateTo,
          direction,
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[Football-Data API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", message: errorMessage(error) },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
