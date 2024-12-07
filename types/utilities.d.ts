/**
 * Converts a given date (or the current date if none is provided) to a MySQL-compatible 
 * datetime string in the format 'YYYY-MM-DD HH:MM:SS'.
 *
 * @param date - Optional. A `Date` object or a date string. If not provided, the current date and time will be used.
 * @returns A MySQL-compatible datetime string formatted as 'YYYY-MM-DD HH:MM:SS'.
 */
export function mysql_datetime(date?: Date | string): string;

/**
 * Converts a given date (or the current date if none is provided) to a MySQL-compatible 
 * date string in the format 'YYYY-MM-DD'.
 *
 * @param date - Optional. A `Date` object or a date string. If not provided, the current date will be used.
 * @returns A MySQL-compatible date string formatted as 'YYYY-MM-DD'.
 */
export function mysql_date(date?: Date | string): string;


// /**
//  * Sanitize input to prevent SQL injection.
//  * @param input - The user input to be sanitized.
//  * @returns Escaped and safe input for MySQL queries.
//  */
// export function sanitize(input: string | number | null): string;

// /**
//  * Escape special characters in a string to prevent SQL injection.
//  * @param value - The value to be escaped.
//  * @returns The escaped string.
//  */
// export function escape(value: any): string;

// /**
//  * Formats a query string by replacing placeholders (`?`) with escaped values.
//  * @param query - The base SQL query with placeholders.
//  * @param values - Array of values to replace placeholders.
//  * @returns The formatted query string.
//  */
// export function format(query: string, values: any[]): string;