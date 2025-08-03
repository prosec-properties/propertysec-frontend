import { DateTime } from "luxon";

interface FormatDateOptions {
  inputFormat?: string;
  outputFormat?: string;
  fallback?: string;
  locale?: string;
  timezone?: string;
}

/**
 * Flexible date formatting utility
 *
 * @param dateInput - Date string, Date object, or timestamp
 * @param options - Formatting options
 * @returns Formatted date string or fallback
 *
 * @example
 * formatDate('2023-01-15') // '15 Jan 2023'
 * formatDate(new Date(), { outputFormat: 'yyyy-MM-dd' }) // '2023-07-20'
 * formatDate(undefined, { fallback: 'N/A' }) // 'N/A'
 */
export function formatDate(
  dateInput: string | Date | number | null | undefined,
  options: FormatDateOptions = {}
): string {
  const {
    inputFormat = "iso",
    outputFormat = "dd LLL yyyy",
    fallback = "",
    locale = "en-US",
    timezone = "local",
  } = options;

  if (!dateInput) return fallback;

  try {
    let dateTime: DateTime;

    if (typeof dateInput === "string") {
      dateTime =
        inputFormat === "iso"
          ? DateTime.fromISO(dateInput, { zone: timezone })
          : DateTime.fromFormat(dateInput, inputFormat, { zone: timezone });
    } else if (dateInput instanceof Date) {
      dateTime = DateTime.fromJSDate(dateInput, { zone: timezone });
    } else {
      dateTime = DateTime.fromMillis(dateInput, { zone: timezone });
    }

    return dateTime.setLocale(locale).toFormat(outputFormat);
  } catch (error) {
    console.error("Date formatting error:", error);
    return fallback;
  }
}
