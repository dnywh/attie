import { NextResponse } from "next/server";
import { errorMessage, espnParams } from "@/utils/api/params";

const API_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = espnParams(searchParams);

  if (!params.ok) {
    return NextResponse.json({ error: params.error }, { status: 400 });
  }

  const {
    dateFrom: rawDateFrom,
    dateTo: rawDateTo,
    direction,
    sport,
    league,
    groups,
    limit,
  } = params.value;
  const dateFrom = rawDateFrom.replace(/-/g, "");
  const dateTo = rawDateTo.replace(/-/g, "");

  const apiUrl = `${API_BASE_URL}/${sport}/${league}/scoreboard?dates=${dateFrom}-${dateTo}${groups ? `&groups=${groups}` : ""}&limit=${limit ? limit : 100}`;

  try {
    const response = await fetch(apiUrl);

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
    const matchCount = data.events?.length || 0;

    return NextResponse.json({
      events: data.events || [],
      meta: {
        matchCount,
        dateFrom,
        dateTo,
        direction,
      },
    });
  } catch (error) {
    console.error("[ESPN API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", message: errorMessage(error) },
      { status: 500 }
    );
  }
}
