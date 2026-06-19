import { DEFAULT_WINDOWS } from "@/utils/config/windows";
import { addDays, formatLocalDate, startOfLocalDay } from "@/utils/fixtureTime";
import type { Direction } from "@/types/domain";
import type { FixtureDateRange, FixtureDateWindow } from "./types";

export const initialFixtureWindow = (direction: Direction): FixtureDateWindow =>
  direction === "forwards"
    ? {
        fromOffset: DEFAULT_WINDOWS.INITIAL.FUTURE.start,
        toOffset: DEFAULT_WINDOWS.INITIAL.FUTURE.end,
      }
    : {
        fromOffset: DEFAULT_WINDOWS.INITIAL.PAST.start * -1,
        toOffset: 0,
      };

export const nextFixtureWindow = (
  currentWindow: FixtureDateWindow,
  direction: Direction,
  days = DEFAULT_WINDOWS.INCREMENT.DAYS
): FixtureDateWindow =>
  direction === "forwards"
    ? {
        fromOffset: currentWindow.toOffset + 1,
        toOffset: currentWindow.toOffset + days,
      }
    : {
        fromOffset: currentWindow.fromOffset - days,
        toOffset: currentWindow.fromOffset - 1,
      };

export const fixtureWindowToDateRange = (
  window: FixtureDateWindow,
  today = new Date()
): FixtureDateRange => {
  const localToday = startOfLocalDay(today);

  return {
    dateFrom: formatLocalDate(addDays(localToday, window.fromOffset)),
    dateTo: formatLocalDate(addDays(localToday, window.toOffset)),
  };
};

export const dateRangeForAdapter = (
  window: FixtureDateWindow,
  _adapter: string,
  today = new Date()
): FixtureDateRange => {
  const range = fixtureWindowToDateRange(window, today);

  return range;
};
