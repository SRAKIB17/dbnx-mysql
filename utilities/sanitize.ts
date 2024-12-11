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
export function escape(val: any): string {
    if (val === undefined || val === null) {
        return 'NULL';
    }

    if (typeof val === 'number') {
        return val.toString();
    }

    if (typeof val === 'boolean') {
        return val ? '1' : '0';
    }

    if (typeof val === 'string') {
        return `'${val
            .replace(/\\/g, '\\\\') // Escapes backslashes
            .replace(/'/g, "\\'")  // Escapes single quotes
            .replace(/"/g, '\\"')  // Escapes double quotes
            .replace(/\n/g, '\\n') // Escapes newlines
            .replace(/\t/g, '\t')// Escapes tabs
            .replace(/\r/g, '\\r') // Escapes carriage returns
            .replace(/\f/g, "") // Escape form feed
            }'`;

    }

    if (typeof val === 'object') {
        if (Object.prototype.toString.call(val) === '[object Date]') {
            return `'${(val as Date).toISOString()}'`;
        } else if (Array.isArray(val)) {
            return `(${val.map((item) => escape(item)).join(', ')})`;
        } else if (Buffer.isBuffer(val)) {
            return `'${val.toString('hex')}'`;
        } else if (typeof (val as any).toSqlString === 'function') {
            return String((val as { toSqlString: () => string }).toSqlString());
        } else {
            return JSON.stringify(val); // Remove trailing comma and space
        }
    }
    return `${val}`;
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
