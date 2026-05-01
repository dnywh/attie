import { describe, expect, it } from "vitest";
import {
  fixtureWindowToDateRange,
  initialFixtureWindow,
  nextFixtureWindow,
} from "./windows";

const today = new Date(2026, 4, 1, 12);

describe("fixture windows", () => {
  it("builds the initial backwards window from recent past through today", () => {
    const window = initialFixtureWindow("backwards");

    expect(window).toEqual({ fromOffset: -7, toOffset: 0 });
    expect(fixtureWindowToDateRange(window, today)).toEqual({
      dateFrom: "2026-04-24",
      dateTo: "2026-05-01",
    });
  });

  it("builds the initial forwards window from today into the future", () => {
    const window = initialFixtureWindow("forwards");

    expect(window).toEqual({ fromOffset: 0, toOffset: 28 });
    expect(fixtureWindowToDateRange(window, today)).toEqual({
      dateFrom: "2026-05-01",
      dateTo: "2026-05-29",
    });
  });

  it("advances load-more windows without overlapping boundaries", () => {
    const backwards = nextFixtureWindow(
      initialFixtureWindow("backwards"),
      "backwards"
    );
    const forwards = nextFixtureWindow(
      initialFixtureWindow("forwards"),
      "forwards"
    );

    expect(backwards).toEqual({ fromOffset: -21, toOffset: -8 });
    expect(fixtureWindowToDateRange(backwards, today)).toEqual({
      dateFrom: "2026-04-10",
      dateTo: "2026-04-23",
    });
    expect(forwards).toEqual({ fromOffset: 29, toOffset: 42 });
    expect(fixtureWindowToDateRange(forwards, today)).toEqual({
      dateFrom: "2026-05-30",
      dateTo: "2026-06-12",
    });
  });
});
