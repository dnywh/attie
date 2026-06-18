import { NextResponse } from "next/server";
import { errorMessage, espnParams } from "@/utils/api/params";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const API_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports";
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = espnParams(searchParams);

  if (!params.ok) {
    return NextResponse.json(
      { error: params.error },
      { status: 400, headers: NO_STORE_HEADERS }
    );
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
    const response = await fetch(apiUrl, { cache: "no-store" });

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
    const matchCount = data.events?.length || 0;

    return NextResponse.json(
      {
        events: data.events || [],
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
    console.error("[ESPN API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures", message: errorMessage(error) },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
