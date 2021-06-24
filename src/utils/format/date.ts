/**
 * type: 'date', 'datetime'
 */
export function date2Array(date: Date = new Date(), type: 'date' | 'datetime' = 'date'): number[] {
  return type === 'date'
    ? [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    : [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
}

/**
 * 返回值: Date
 * array 只支持
 *  [year, month, day]
 *  [year, month, day, hour, minute]
 */
export function array2Date(array: number[], date = new Date()): Date {
  if (array.length === 3) {
    date.setFullYear(array[0]);
    date.setMonth(array[1] - 1);
    date.setDate(array[2]);
    return date;
  }
  if (array.length === 5) {
    date.setFullYear(array[0]);
    date.setMonth(array[1] - 1);
    date.setDate(array[2]);
    date.setHours(array[3]);
    date.setMinutes(array[4]);
  }
  return date;
}

/**
 * 该月份下的天数
 */
export function getMonthDate(date: Date): number {
  return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
}

/**
 * Compares two `Date` with year, month and date.
 */
export function compareDates(dateA: Date, dateB: Date): boolean {
  if (!dateA && !dateB) {
    return true;
  }
  if (!dateA || !dateB) {
    return false;
  }
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function compareDateFunction(dateA: Date, dateB: Date): number {
  return dateA.getTime() - dateB.getTime();
}

/**
 * Get array of dates day by day
 * @param start The start date
 * @param end The end date
 */
export function getDateRangeArray(start: Date, end: Date): Date[] {
  start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  end = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const result: Date[] = [start];

  if (compareDates(start, end)) {
    return result;
  }
  if (start.getTime() > end.getTime()) {
    [start, end] = [end, start];
  }

  let next: Date = start;
  do {
    next = new Date(next.getTime());
    next.setDate(next.getDate() + 1);
    result.push(next);
  } while (!compareDates(next, end));

  return result;
}

export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

/**
 * All days of week
 */
export const DAYS_OF_WEEK: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
