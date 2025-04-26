import { ConnectionOptions, PoolOptions } from "mysql2";
import { DB } from "./execute.js";
import { Query } from "./query.js";
import { Filters } from "../utils/index.js";
import { ColumnOptions, TableOptions } from "../types/index.js";
import { Model } from "./model.js";
export declare class DBnxHandler extends Query {
  #private;
  constructor(
    db: DB,
    dbConfig: ConnectionOptions | PoolOptions | string | null,
  );
  get getConfig(): ConnectionOptions | PoolOptions | null;
  /**
   * Defines a model with the specified name, attributes, and optional configuration.
   * @param {string} modelName - The name of the model (e.g., "users").
   * @param {Record<string, ColumnOptions>} attributes - The attributes of the model (columns).
   * @param {TableOptions} [options] - Optional configurations such as indexes or foreign keys.
   * @returns {typeof Model} - The defined model class for performing CRUD operations.
   */
  define(
    modelName: string,
    attributes: Record<string, ColumnOptions>,
    options?: TableOptions,
  ): typeof Model;
  /**
   * Closes the connection or pool, ensuring all resources are freed.
   * @returns {Promise<void>} - A promise that resolves when the connection or pool is closed.
   */
  close(): Promise<void>;
  /**
   * Builds the SQL query string by appending parameters and preparing the final query string.
   * @returns {string} - The final SQL query string after appending the parameters.
   */
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
  condition(filters: Filters, joinBy?: "AND" | "OR"): string;
}
