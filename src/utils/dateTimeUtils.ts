import { DateTime } from 'luxon';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Combines a Date object with a time string (HH:MM AM/PM) and optionally adjusts to a specific timezone.
 * @param {Date} dateObj - The base Date object.
 * @param {string} timeStr - The time string in 12-hour format (e.g., "02:30 PM").
 * @param {string} [timeZone] - Optional IANA timezone (e.g., "America/New_York").
 * @returns {Date} A new Date object with the combined date and time.
 */
export function combineDateAndTime(dateObj: Date, timeStr: string, timeZone?: string): dayjs.Dayjs {
    let dateTime = dayjs(dateObj); // Keep it in local time first

    // Extract time and AM/PM
    const timeMatch = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
    if (!timeMatch) throw new Error("Invalid time format");

    let [_, hours, minutes, period] = timeMatch;
    let hourNum = parseInt(hours, 10);
    const minuteNum = parseInt(minutes, 10);

    // Convert 12-hour time to 24-hour format
    if (period.toUpperCase() === "PM" && hourNum !== 12) {
        hourNum += 12;
    } else if (period.toUpperCase() === "AM" && hourNum === 12) {
        hourNum = 0;
    }

    // Set time on the Day.js object
    dateTime = dateTime.hour(hourNum).minute(minuteNum).second(0).millisecond(0);

    // Convert to specified timezone if provided
    if (timeZone) {
        dateTime = dateTime.tz(timeZone);
    }

    return dateTime; 
}
export function isNew(receivedDate: string | Date): boolean {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    // Ensure receivedDate is a Date object
    const received = new Date(receivedDate);
  
    // Check if receivedDate is today or yesterday
    return (
      received.toDateString() === today.toDateString() || 
      received.toDateString() === yesterday.toDateString()
    );
  }

  export function timeAgo(date: Date): string {
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    const daysAgo = Math.floor(secondsAgo / 86400);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(daysAgo / 30.44);
    const yearsAgo = Math.floor(monthsAgo / 12);

    if (yearsAgo > 0) {
        return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
    } else if (monthsAgo > 0) {
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    } else if (weeksAgo > 0) {
        return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
    } else if (daysAgo > 1) {
        return `${daysAgo} days ago`;
    } else {
        return `Today`;
    }
}

/**
 * Gets the current date and time in a specified time zone, or a custom date if provided.
 * Optionally, you can also pass a custom time (either 24-hour or 12-hour format) to override the time part.
 * 
 * @param {string} timeZone - The time zone (e.g., 'Asia/Shanghai').
 * @param {string | Date} [customDate] - An optional custom date (e.g., '2025-03-28') or Date object.
 * @param {string} [customTime] - An optional custom time (e.g., '14:30:00' or '02:30:00 PM').
 * @param {boolean} [isUTC] - If utc no utc conversion will happen.
 * @returns {dayjs.Dayjs} - The current or custom date and time in the specified time zone as a dayjs object.
 */
export const getDateInTimezone = (
    timezone: string,
    customDate?: string,
    customTime?: string,
    isUTC: boolean = true
  ) => {
    // Step 1: Combine the date and time into a single string
    let combinedDateTime = '';
    
    if (customDate && customTime) {
      combinedDateTime = `${customDate} ${customTime}`;
    } else if (customDate) {
      combinedDateTime = `${customDate} ${dayjs().format('hh:mm A')}`;
    } else if (customTime) {
      combinedDateTime = `${dayjs().format('MMMM DD, YYYY')} ${customTime}`;
    } else {
      combinedDateTime = dayjs().format('MMMM DD, YYYY hh:mm A');
    }
  
    // Step 2: Parse the datetime string in the provided timezone (not UTC)
    let date = dayjs.tz(combinedDateTime, timezone); // Treat the input as being in the given timezone
  
    // Step 3: If isUTC is true, convert to UTC time
    if (isUTC) {
      date = date.utc(); // Convert to UTC
    }
  
    // Step 4: Return the Day.js object for UTC
    return date;
  };
/**
 * Converts a date or date-time (with optional time) to the specified timezone's time.
 * Supports both ISO format and custom format like "March 28, 2025 8:00 PM".
 *
 * @param {string} inputTime - The time as a string, either in ISO format or custom format.
 * @param {string} timezone - The full name of the timezone, e.g., 'Asia/Shanghai'.
 * @returns {DateTime} - The Luxon DateTime object in the target timezone.
 */
export const convertUTCToTimezone = (inputTime: string, timezone: string): DateTime => {
    let dateTime: DateTime;
    // Check if the input is in ISO format (date or date-time, e.g., '2025-03-29' or '2025-03-29T12:00:00Z')
    if (inputTime.includes('-')) {
      // Handle ISO format date-time or date-only
      if (inputTime.length === 10) {
        // Date-only format (e.g., '2025-03-29')
        dateTime = DateTime.fromISO(inputTime, { zone: 'utc' }).startOf('day');
      } else {
        // Full ISO format (e.g., '2025-03-29T12:00:00Z')
        dateTime = DateTime.fromISO(inputTime, { zone: 'utc' });
      }
    } else {
      // Handle custom format (e.g., "March 28, 2025" or "March 28, 2025 8:00 PM")
      if (inputTime.includes(':') || inputTime.includes('PM') || inputTime.includes('AM')) {
        // Date-time with time (e.g., "March 28, 2025 8:00 PM")
        dateTime = DateTime.fromFormat(inputTime, 'MMMM dd, yyyy hh:mm a', { zone: 'utc' });
      } else {
        // Date-only custom format (e.g., "March 28, 2025")
        dateTime = DateTime.fromFormat(inputTime, 'MMMM dd, yyyy', { zone: 'utc' }).startOf('day');
      }
    }
  
    // Convert to the specified timezone
    dateTime = dateTime.setZone(timezone);
  
    // Return the Luxon DateTime object in the target timezone
    return dateTime;
  };
  
  /**
 * Gets the short time zone abbreviation for a given time zone.
 * 
 * @param {string} timezone - The time zone (e.g., 'Europe/Bratislava').
 * @returns {string} - The short time zone abbreviation (e.g., 'CEST').
 */
export const getTimezoneAbbreviation = (timezone: string) => {
    const shortTimezone = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    })
      .formatToParts(new Date())
      .find(part => part.type === 'timeZoneName')?.value;
  
    return shortTimezone;
  };