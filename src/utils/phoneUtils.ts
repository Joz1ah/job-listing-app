import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Extracts the country code from a phone number.
 * @param phoneNumber - The phone number as a string.
 * @returns The country code (e.g., "US") or null if invalid.
 */
export const getCountryByNumber = (phoneNumber: string): string | null => {
  try {
    // Remove non-numeric characters except '+'
    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

    const phoneNumberObj = parsePhoneNumberFromString(cleanedNumber);

    return phoneNumberObj?.country ?? null; // Ensures it only returns string or null
  } catch (error) {
    return null;
  }
};
