import { Filters } from "../types";
import { sanitize } from "./sanitize";

/**
 * Handles pattern sanitization for SQL query operators (LIKE, REGEXP, NOT LIKE).
 * Escapes special characters for REGEXP and formats patterns for LIKE.
 * 
 * @param value The value to be used in the pattern (e.g., a string for LIKE, REGEXP)
 * @param operator The operator to be applied to the value: "REGEXP", "LIKE", or "NOT LIKE"
 * @returns The sanitized value ready for use in the SQL condition
 */
function handlePattern(value: string, operator: "REGEXP" | "LIKE" | "NOT LIKE"): string {
    const escapeRegexp = (str: string): string => {
        // Escape special characters for REGEXP
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    };

    switch (operator) {
        case "REGEXP":
            // For REGEXP, replace '%' with '.*' and '_' with '.' (like in your original logic)
            return escapeRegexp(value.replace(/%/g, ".*").replace(/_/g, "."));

        case "NOT LIKE":
        case "LIKE":
            // For LIKE, return the string as is, it will be handled by SQL
            return value;

        default:
            return value;
    }
}

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
export function dbnxCondition(filters: Filters, joinBy: 'AND' | 'OR' = 'AND'): string {
    let conditions: string[] = [];
    const operatorRegex = /^(<=|>=|!=|<|>|=)/; // Matches all supported operators

    for (const column in filters) {
        const value = filters[column as keyof Filters];
        if (column == '$and') {
            conditions.push(`(${dbnxCondition(value as Filters, 'AND')})`);
        }
        else if (column == '$or') {
            conditions.push(`(${dbnxCondition(value as Filters, 'OR')})`);
        }
        else if (typeof value == 'object') {
            if (Array.isArray(value)) {
                // Handle 'IN' condition
                conditions.push(`\`${column}\` IN ${sanitize(value)}`);
            }
            else {
                //FOr not include
                if (Array.isArray(value?.not) && value?.not) {
                    conditions.push(`\`${column}\` NOT IN ${sanitize(value?.not)}`);
                }
                if (Array.isArray(value?.between) && value?.between?.length == 2) {
                    conditions.push(`\`${column}\` BETWEEN ${sanitize(value?.between?.[0])} AND ${sanitize(value?.between?.[0])}`);
                }
                if (Array.isArray(value?.inRange) && value?.inRange?.length == 2) {
                    conditions.push(`\`${column}\` BETWEEN ${sanitize(value?.inRange?.[0])} AND ${sanitize(value?.inRange?.[1])}`);
                }
                if (Array.isArray(value?.$or) && value?.$or?.length) {
                    const orConditions = value.$or.map((subFilter) => dbnxCondition({ [column]: subFilter }, 'OR'));
                    conditions.push(`(${orConditions.join(" OR ")})`);
                }
                if (Array.isArray(value?.$and) && value?.$and?.length) {
                    const orConditions = value.$and.map((subFilter) => dbnxCondition({ [column]: subFilter }, 'AND'));
                    conditions.push(`(${orConditions.join(" AND ")})`);
                }
                if ((value.like) && typeof value?.like == 'string') {
                    conditions.push(`\`${column}\` LIKE ${sanitize(handlePattern(value.like, "LIKE"))}`);
                }

                if ((value.notLike) && typeof value?.notLike == 'string') {
                    conditions.push(`\`${column}\` NOT LIKE ${sanitize(handlePattern(value.notLike, "NOT LIKE"))}`);
                }
                if ((value.regexp) && typeof value?.regexp == 'string') {
                    conditions.push(`\`${column}\` REGEXP ${sanitize(handlePattern(value.regexp, "REGEXP"))}`);
                }
                if (value?.isNull != undefined) {
                    if (value.isNull) {
                        conditions.push(`\`${column}\` IS NULL`);
                    } else {
                        conditions.push(`\`${column}\` IS NOT NULL`);
                    }
                }
            }
        }
        else if (typeof value === 'string') {
            if (typeof value === 'string' && operatorRegex.test(value)) {
                // Handle custom operators (e.g., >=1000, <500)
                const operator = value.slice(0, 2).trim(); // e.g., >= or <
                conditions.push(`\`${column}\` ${operator} ${sanitize(value.slice(2).trim())}`);
            }
            else {
                // Handle '=' condition
                const sanitizedValue = value.toString().replace(/'/g, "\\'");
                conditions.push(`\`${column}\` = ${sanitize(sanitizedValue)}`);
            }
        }
        // conditions.push
        // conditions += conditions ? ` ${joinBy || "AND"} ${condition}` : condition
    }
    return conditions?.length ? conditions?.join(` ${joinBy || 'AND'} `) : "";
}

