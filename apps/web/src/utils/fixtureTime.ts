import type { CommonFixture } from "@/types/domain";

export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type DateRange = {
  dateFrom: string;
  dateTo: string;
};

export const fixtureInstantMs = (
  fixture: Pick<CommonFixture, "utcDate">
): number => new Date(fixture.utcDate).getTime();

export const startOfLocalDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const localDayKey = (date: Date): number =>
  startOfLocalDay(date).getTime();

export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const addDays = (date: Date, offset: number): Date =>
  new Date(date.getTime() + offset * MS_PER_DAY);

export const addDaysToDateString = (
  dateString: string,
  days: number
): string => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
};

export const padDateRange = (
  range: DateRange,
  { before, after }: { before: number; after: number }
): DateRange => ({
  dateFrom: addDaysToDateString(range.dateFrom, before * -1),
  dateTo: addDaysToDateString(range.dateTo, after),
});
