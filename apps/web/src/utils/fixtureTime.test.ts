import { describe, expect, it } from "vitest";
import {
  fixtureInstantMs,
  localDayKey,
  padDateRange,
  startOfLocalDay,
} from "@/utils/fixtureTime";

describe("fixture time helpers", () => {
  it("uses UTC/unix time for fixture instants", () => {
    expect(
      fixtureInstantMs({
        utcDate: "2026-05-01T10:00:00Z",
      })
    ).toBe(Date.parse("2026-05-01T10:00:00Z"));
  });

  it("uses local calendar days for display grouping", () => {
    const date = new Date(2026, 4, 1, 12);

    expect(localDayKey(date)).toBe(startOfLocalDay(date).getTime());
  });

  it("pads provider date ranges by calendar date string", () => {
    expect(
      padDateRange(
        {
          dateFrom: "2026-05-01",
          dateTo: "2026-05-29",
        },
        { before: 1, after: 1 }
      )
    ).toEqual({
      dateFrom: "2026-04-30",
      dateTo: "2026-05-30",
    });
  });
});
