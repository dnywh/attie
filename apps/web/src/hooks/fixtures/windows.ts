import { DEFAULT_WINDOWS } from "@/utils/config/windows";
import type { Direction } from "@/types/domain";
import type { FixtureDateRange, FixtureDateWindow } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, offset: number): Date => {
  return new Date(date.getTime() + offset * MS_PER_DAY);
};

const startOfLocalDay = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

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
  adapter: string,
  today = new Date()
): FixtureDateRange => {
  const range = fixtureWindowToDateRange(window, today);

  if (adapter !== "espn") {
    return range;
  }

  return {
    ...range,
    dateTo: formatLocalDate(
      addDays(startOfLocalDay(today), window.toOffset + 1)
    ),
  };
};
