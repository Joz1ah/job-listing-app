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
    let dateTime = dayjs(dateObj).utc(); // Convert Date object to a Day.js instance in UTC

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

export function isNew(receivedDate: string): boolean {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
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
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const monthsAgo = Math.floor(daysAgo / 30.44); // Average month length
    const yearsAgo = Math.floor(monthsAgo / 12);

    if (yearsAgo > 0) {
        return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
    } else if (monthsAgo > 0) {
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    } else if (daysAgo > 0) {
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
        return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else if (minutesAgo > 0) {
        return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    } else {
        return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
    }
}