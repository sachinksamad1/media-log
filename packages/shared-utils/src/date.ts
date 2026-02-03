import { format, parseISO, isValid } from "date-fns";

/**
 * Standard date formats
 */
export const DateFormats = {
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  DisplayDate: "MMM d, yyyy", // Feb 3, 2026
  DisplayDateTime: "MMM d, yyyy @ h:mm a", // Feb 3, 2026 @ 1:21 PM
  InputDate: "yyyy-MM-dd", // 2026-02-03 (for HTML input type="date")
} as const;

/**
 * Parses any date-like input into a Date object
 */
interface TimestampLike {
  toDate: () => Date;
}

export const parseDate = (
  date: Date | string | number | null | undefined | TimestampLike,
): Date | null => {
  if (!date) return null;

  if (date instanceof Date) return date;

  if (typeof date === "number") return new Date(date);

  if (typeof date === "string") {
    const d = parseISO(date);
    return isValid(d) ? d : new Date(date);
  }

  // Handle Firebase Timestamp-like objects (duck typing)
  if (
    typeof date === "object" &&
    "toDate" in date &&
    typeof (date as TimestampLike).toDate === "function"
  ) {
    return (date as TimestampLike).toDate();
  }

  return null;
};

/**
 * Formats a date to ISO string safely
 */
export const toISOString = (
  date: Date | string | number | null | undefined,
): string => {
  const d = parseDate(date);
  return d ? d.toISOString() : new Date().toISOString();
};

/**
 * Formats a date for display
 */
export const formatDate = (
  date: Date | string | number | null | undefined,
  pattern: string = DateFormats.DisplayDate,
): string => {
  const d = parseDate(date);
  if (!d || !isValid(d)) return "N/A";
  return format(d, pattern);
};

/**
 * Formats a date for display with time
 */
export const formatDateTime = (
  date: Date | string | number | null | undefined,
): string => {
  return formatDate(date, DateFormats.DisplayDateTime);
};
