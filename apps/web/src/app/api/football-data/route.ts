import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/constants/config";
import { errorMessage, footballDataParams } from "@/utils/api/params";

const API_BASE_URL = "https://api.football-data.org/v4";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = footballDataParams(searchParams);

  if (!params.ok) {
    return NextResponse.json({ error: params.error }, { status: 400 });
  }

  const { dateFrom, dateTo, direction, competitionCode } = params.value;

  try {
    const response = await fetch(
      `${API_BASE_URL}/competitions/${competitionCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "",
          "User-Agent": APP_CONFIG.USER_AGENT,
        },
      }
    );

    if (response.status === 204) {
      return NextResponse.json({ matches: [], message: "No matches found" });
    }

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded", isRateLimit: true },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `API error: ${response.status}`, message: "API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const matchCount = data.matches?.length || 0;

    return NextResponse.json({
      ...data,
      meta: {
        matchCount,
        dateFrom,
        dateTo,
        direction,
      },
    });
  } catch (error) {
    console.error("[Football-Data API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", message: errorMessage(error) },
      { status: 500 }
    );
  }
}
