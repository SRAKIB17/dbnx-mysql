
/**
 * Type representing the possible values that can be used in the filters.
 * 
 * - string | number: Used for simple equality checks.
 * - Array<string | number>: Used for `IN` checks.
 * - { not: Array<string | number> }: Used for `NOT IN` checks.
 * - { between: [number, number] }: Used for `BETWEEN` checks.
 * - { inRange: [number, number] }: Similar to `BETWEEN` but for range checks.
 * - { $or: FilterValue[] }: Logical OR condition.
 * - { like: string }: Used for `LIKE` operator (pattern matching).
 * - { notLike: string }: Used for `NOT LIKE` operator (pattern matching).
 * - { isNull: boolean }: Used for checking if a value is NULL or NOT NULL.
 * - { $and: FilterValue[] }: Logical AND condition.
 * - { regexp: string }: Used for `REGEXP` operator (regular expression matching).
 */
type FilterValue = string | number | Array<string | number>
    | {
        not?: Array<string | number>;           // NOT IN condition
        between?: [number, number];            // BETWEEN condition
        inRange?: [number, number];            // Range check (similar to BETWEEN)
        $or?: FilterValue[];                   // Logical OR condition
        like?: string;                         // LIKE condition for pattern matching
        notLike?: string;                      // NOT LIKE condition for pattern matching
        isNull?: boolean;                      // Check for NULL or NOT NULL
        $and?: FilterValue[];                  // Logical AND condition
        regexp?: string;                       // REGEXP condition (regex matching)
    }

/**
 * A type for the Filters object.
 * Filters can be defined with the property keys being column names, 
 * and values can be FilterValue or logical conditions ($or, $and).
 */
type Filters = {
    [key: string]: FilterValue;             // For columns directly mapped to FilterValue
} | {
    $or?: Record<string, FilterValue>;      // Logical OR condition for multiple filters
    $and?: Record<string, FilterValue>;     // Logical AND condition for multiple filters
};
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