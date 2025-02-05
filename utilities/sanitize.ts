/**
 * Sanitize input to prevent SQL injection.
 * @param input - The user input to be sanitized.
 * @returns Escaped and safe input for MySQL queries.
 */
export function sanitize(input: any): string {
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
        // Escape special characters
        return `'${val.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
            switch (char) {
                case '\0': return '\\0'; // Null character
                case '\x08': return '\\b'; // Backspace
                case '\x09': return '\\t'; // Tab
                case '\x1a': return '\\z'; // Substitute
                case '\n': return '\\n'; // Newline
                case '\r': return '\\r'; // Carriage return
                case '"': return '\\"'; // Double quote
                case "'": return "\\'"; // Single quote
                case '\\': return '\\\\'; // Backslash
                case '%': return '\\%'; // Percent sign (used in LIKE queries)
                default: return char; // No escaping needed
            }
        })}'`;
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


export interface MySQLConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
    params: Record<string, any>
}

export function parseMySQLUrl(url: string): MySQLConfig {
    const regex = /^(mysql:\/\/)([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/([^?]+)(?:\?(.*))?$/;

    const match = url.match(regex);
    if (!match) {
        throw new Error("Invalid MySQL URL format");
    }
    const [, , user, password, host, port, database, queryParams] = match;

    const params: { [key: string]: string } = {};

    if (queryParams) {
        queryParams.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
    }
    return {
        user,
        password,
        host,
        port: port ? parseInt(port, 10) : 3306, // Default MySQL port is 3306
        database,
        params
    };
}