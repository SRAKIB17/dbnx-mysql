export function sanitize(input) {
    return escape(input);
}
export function escape(val) {
    if (val === undefined || val === null) {
        return "NULL";
    }
    if (typeof val === "number") {
        return val.toString();
    }
    if (typeof val === "boolean") {
        return val ? "1" : "0";
    }
    if (typeof val === "string") {
        return `'${val.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case '"':
                    return '\\"';
                case "'":
                    return "\\'";
                case "\\":
                    return "\\\\";
                case "%":
                    return "\\%";
                default:
                    return char;
            }
        })}'`;
    }
    if (typeof val === "object") {
        if (Object.prototype.toString.call(val) === "[object Date]") {
            return `'${val.toISOString()}'`;
        }
        else if (Array.isArray(val)) {
            return `(${val.map((item) => escape(item)).join(", ")})`;
        }
        else if (Buffer.isBuffer(val)) {
            return `'${val.toString("hex")}'`;
        }
        else if (typeof val.toSqlString === "function") {
            return String(val.toSqlString());
        }
        else {
            return JSON.stringify(val);
        }
    }
    return `${val}`;
}
export function format(query, values) {
    let i = 0;
    return query.replace(/\?/g, () => {
        if (i >= values.length) {
            throw new Error("Insufficient values provided for placeholders.");
        }
        const escapedValue = escape(values[i]);
        i++;
        return escapedValue;
    });
}
export function parseMySQLUrl(url) {
    const regex = /^(mysql:\/\/)([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/([^?]+)(?:\?(.*))?$/;
    const match = url.match(regex);
    if (!match) {
        throw new Error("Invalid MySQL URL format");
    }
    const [, , user, password, host, port, database, queryParams] = match;
    const params = {};
    if (queryParams) {
        queryParams.split("&").forEach((param) => {
            const [key, value] = param.split("=");
            if (key && value) {
                params[key] = decodeURIComponent(value);
            }
        });
    }
    return {
        user,
        password,
        host,
        port: port ? parseInt(port, 10) : 3306,
        database,
        params,
    };
}
