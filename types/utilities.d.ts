import { Filters } from "./condition";

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


/**
 * Sanitize input to prevent SQL injection.
 * @param input - The user input to be sanitized.
 * @returns Escaped and safe input for MySQL queries.
 */
export function sanitize(input: any): string;

/**
 * Escape special characters in a string to prevent SQL injection.
 * @param value - The value to be escaped.
 * @returns The escaped string.
 */
export function escape(value: any): string;

/**
 * Formats a query string by replacing placeholders (`?`) with escaped values.
 * @param query - The base SQL query with placeholders.
 * @param values - Array of values to replace placeholders.
 * @returns The formatted query string.
 */
export function format(query: string, values: any[]): string;


/**
 * Generates SQL conditions based on the filters object.
 * It dynamically builds the WHERE clause for SQL based on the provided filters and logical operations.
 * 
 * @param filters The filters object containing the conditions
 * @param joinBy The logical operator to join conditions (default: 'AND', can be 'OR')
 * @returns The generated SQL condition string
 * @example
 * // Example filters
const filters: Filters = {
    status: "active", // Exact match
    price: { between: [1000, 5000] }, // BETWEEN condition
    tags: ["electronics", "home"], // IN condition
    location: { not: ["New York", "California"] }, // NOT IN condition
    stock: { inRange: [10, 50] }, // IN RANGE condition (BETWEEN)
    updatedAt: { isNull: true }, // IS NULL condition
    title: { like: "%phone%" }, // LIKE condition (pattern matching)
    description: { notLike: "%old%" }, // NOT LIKE condition
    color: {
        $or: [
            { like: "red" },
            { like: "blue" },
        ],
    }, // OR condition
    $and: {
        category: "electronics",
        brand: { regexp: "^Samsung" }, // REGEXP condition
    },
};
* @Output
```sql
SELECT * FROM products WHERE 
`status` = 'active' AND 
`price` BETWEEN 1000 AND 5000 AND 
`tags` IN ('electronics', 'home') AND 
`location` NOT IN ('New York', 'California') AND 
`stock` BETWEEN 10 AND 50 AND 
`updatedAt` IS NULL AND 
`title` LIKE '%phone%' AND 
`description` NOT LIKE '%old%' AND 
(
    `color` LIKE 'red' OR 
    `color` LIKE 'blue'
) AND 
(
    `category` = 'electronics' AND 
    `brand` REGEXP '^Samsung'
);

```
 */
export function dbnxCondition(filters: Filters, joinBy: 'AND' | 'OR' = 'AND'): string