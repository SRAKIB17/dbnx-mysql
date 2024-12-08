/**
 * Sanitize input to prevent SQL injection.
 * @param input - The user input to be sanitized.
 * @returns Escaped and safe input for MySQL queries.
 */
export function sanitize(input: string | number | null): string {
    return escape(input);
}

/**
 * Escape special characters in a string to prevent SQL injection.
 * @param value - The value to be escaped.
 * @returns The escaped string.
 */
export function escape(value: any): string {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }
    if (typeof value === 'string') {
        return `'${value
            .replace(/\\/g, '\\\\') // Escapes backslashes
            .replace(/'/g, "\\'") // Escapes single quotes
            .replace(/"/g, '\\"') // Escapes double quotes
            .replace(/\n/g, '\\n') // Escapes newlines
            .replace(/\r/g, '\\r') // Escapes carriage returns
            .replace(/\t/g, '\\t')}'`; // Escapes tabs
    }
    throw new Error(`Unsupported value type: ${typeof value}`);
}

/**
 * Formats a query string by replacing placeholders (`?`) with escaped values.
 * @param query - The base SQL query with placeholders.
 * @param values - Array of values to replace placeholders.
 * @returns The formatted query string.
 */
export function format(query: string, values: any[]): string {
    let i = 0;
    return query.replace(/\?/g, () => {
        if (i >= values.length) {
            throw new Error('Insufficient values provided for placeholders.');
        }
        const escapedValue = escape(values[i]);
        i++;
        return escapedValue;
    });
}
