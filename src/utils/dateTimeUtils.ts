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
