/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { PROJECT_CONFIG } from '../config/project';

/**
 * Initialize dayjs with required plugins and timezone settings
 */
export const initializeDayjs = (): void => {
  // Configure dayjs plugins
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(relativeTime);

  // Set default timezone
  dayjs.tz.setDefault?.(PROJECT_CONFIG.timezone);
};

/**
 * Default time format patterns
 */
export const TIME_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  RELATIVE: 'from_now', // Special marker for relative time
} as const;

/**
 * Format PHP timestamp to human-readable time string
 * @param timestamp - PHP timestamp (seconds since Unix epoch)
 * @param format - Time format pattern or predefined format key
 * @returns Formatted time string
 */
export const formatTime = (timestamp: number, format: string = TIME_FORMATS.DATETIME): string => {
  try {
    // PHP timestamp is in seconds, JavaScript Date expects milliseconds
    const jsTimestamp = timestamp * 1000;
    const date = (dayjs as any)(jsTimestamp);

    // Check if the date is valid
    if (!date.isValid()) {
      console.error('Invalid timestamp provided:', timestamp);
      return 'Invalid Date';
    }

    // Handle relative time format
    if (format === TIME_FORMATS.RELATIVE || format === 'from_now') {
      return date.fromNow();
    }

    // Use predefined format if format is a key in TIME_FORMATS
    const formatPattern = TIME_FORMATS[format as keyof typeof TIME_FORMATS] || format;

    return date.format(formatPattern);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Date';
  }
};

/**
 * Get current PHP timestamp
 * @returns Current timestamp in seconds
 */
export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Convert JavaScript Date to PHP timestamp
 * @param date - JavaScript Date object
 * @returns PHP timestamp in seconds
 */
export const dateToTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

/**
 * Convert PHP timestamp to JavaScript Date object
 * @param timestamp - PHP timestamp in seconds
 * @returns JavaScript Date object
 */
export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};

/**
 * Check if a timestamp is valid
 * @param timestamp - PHP timestamp to validate
 * @returns True if timestamp is valid
 */
export const isValidTimestamp = (timestamp: number): boolean => {
  return (dayjs as any)(timestamp * 1000).isValid();
};

/**
 * Format time with relative fallback
 * Shows relative time for recent dates, absolute time for older dates
 * @param timestamp - PHP timestamp
 * @param cutoffDays - Days after which to show absolute time (default: 7)
 * @param absoluteFormat - Format for absolute time display
 * @returns Formatted time string
 */
export const formatTimeWithFallback = (
  timestamp: number,
  cutoffDays: number = 7,
  absoluteFormat: string = TIME_FORMATS.DISPLAY_DATETIME,
): string => {
  const date = (dayjs as any)(timestamp * 1000);
  const now = (dayjs as any)();
  const daysDiff = now.diff(date, 'day');

  if (daysDiff <= cutoffDays) {
    return date.fromNow();
  }

  return date.format(absoluteFormat);
};
