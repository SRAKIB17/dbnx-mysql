import { ConnectionOptions, PoolOptions } from "mysql2/promise";
import { Model } from "./model";
import { TableOptions } from "./model-define";
import { CreateOptionsType, CreateParamsType, DeleteParamsType, FindAllParamsType, FindOneParamsType, UpdateParamsType } from "../query";
import { ColumnOptions, ResponseType } from "../types";
import { Filters } from "../utils/condition";
export declare class DBnx {
    #private;
    constructor(dbConfig: ConnectionOptions | PoolOptions | string, usePool?: boolean, logger?: (log: any) => void);
    constructor(dbConfig: ConnectionOptions | PoolOptions | string, logger?: (log: any) => void);
    constructor(dbConfig: ConnectionOptions | PoolOptions | string);
    /**
     * Establishes a database connection using either a connection pool or a single connection.
     * @param {function} [props] - Optional callback function for success or error handling.
     * @returns {DBnx} - The current instance of DBnx.
     */
    connect(props?: (err?: any, success?: any) => void): this;
    /**
     * Executes the provided SQL query with the given parameters and optional additional data.
     * @param {string} [sql] - The SQL query string to be executed.
     * @param {string[] | string[][]} [params] - Optional parameters for the SQL query.
     * @param {Record<string, any>} [additional] - Optional additional data to be included in the response.
     * @param {function} [responseFn] - Optional callback function to handle the response.
     * @returns {Promise<ResponseType>} - A promise resolving to the response data.
     */
    execute(sql?: string, params?: string[] | string[][], additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    execute(sql?: string, additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    execute(sql?: string, additional?: Record<string, any>): Promise<ResponseType>;
    execute(sql?: string, responseFn?: (data: any) => any): Promise<ResponseType>;
    execute(sql?: string): Promise<ResponseType>;
    execute(additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    execute(additional: Record<string, any>): Promise<ResponseType>;
    execute(responseFn?: (data: any) => any): Promise<ResponseType>;
    /**
     * Executes the provided SQL query with the given parameters and optional additional data, using the query method.
     * @param {string} [sql] - The SQL query string to be executed.
     * @param {string[] | string[][]} [params] - Optional parameters for the SQL query.
     * @param {Record<string, any>} [additional] - Optional additional data to be included in the response.
     * @param {function} [responseFn] - Optional callback function to handle the response.
     * @returns {Promise<ResponseType>} - A promise resolving to the response data.
     */
    executeQuery(sql?: string, params?: string[] | string[][], additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeQuery(sql?: string, additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeQuery(sql?: string, additional?: Record<string, any>): Promise<ResponseType>;
    executeQuery(sql?: string, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeQuery(sql?: string): Promise<ResponseType>;
    executeQuery(additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeQuery(additional: Record<string, any>): Promise<any>;
    executeQuery(responseFn?: (data: any) => any): Promise<ResponseType>;
    /**
     * Defines a model with the specified name, attributes, and optional configuration.
     * @param {string} modelName - The name of the model (e.g., "users").
     * @param {Record<string, ColumnOptions>} attributes - The attributes of the model (columns).
     * @param {TableOptions} [options] - Optional configurations such as indexes or foreign keys.
     * @returns {typeof Model} - The defined model class for performing CRUD operations.
     */
    define(modelName: string, attributes: Record<string, ColumnOptions>, options?: TableOptions): any;
    /**
     * Creates a new record in the specified table or model.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {CreateParamsType} values - The values to be inserted into the table/model.
     * @param {CreateOptionsType} [options] - Optional configuration for the insertion.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    create(table: string, values: CreateParamsType<[]>, options?: CreateOptionsType): DBnx;
    create(model: typeof Model, values: CreateParamsType<[]>, options?: CreateOptionsType): Promise<ResponseType>;
    /**
     * Retrieves all records from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindAllParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    findAll<Tables extends string[]>(table: string, Config?: FindAllParamsType<Tables>): DBnx;
    findAll<Tables extends string[]>(model: typeof Model, Config?: FindAllParamsType<Tables>): Promise<ResponseType>;
    /**
     * Retrieves a single record from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindOneParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    findOne<Tables extends string[]>(table: string, Config?: FindOneParamsType<Tables>): DBnx;
    findOne<Tables extends string[]>(model: typeof Model, Config?: FindOneParamsType<Tables>): Promise<ResponseType>;
    /**
     * Updates an existing record in the specified table with the provided properties.
     * @param {string} table - The table to update.
     * @param {UpdateParamsType} Props - The properties to update in the record.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    update<Tables extends string[]>(table: string, Props: UpdateParamsType<Tables>): DBnx;
    update<Tables extends string[]>(model: typeof Model, Props: UpdateParamsType<Tables>): Promise<ResponseType>;
    /**
     * Deletes a record from the specified table based on the provided parameters.
     * @param {string} table - The table from which to delete the record.
     * @param {DeleteParamsType} conditions - The conditions to match for deleting the record(s).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    delete<Tables extends string[]>(table: string, Props: DeleteParamsType<Tables>): DBnx;
    delete<Tables extends string[]>(model: typeof Model, Props: DeleteParamsType<Tables>): Promise<ResponseType>;
    logger_function(log: any): void;
    /**
     * Fetch all configurations used in the connection or pool.
     * @returns Object containing configuration details.
     */
    get getConfig(): ConnectionOptions | PoolOptions | null;
    /**
     * Sets the SQL query string that will be executed later.
     * @param {string} sql - The SQL query string to be set.
     * @returns {DBnx} - The current instance of DBnx for method chaining.
     */
    setQuery(query: string): this;
    /**
     * Builds the SQL query string by appending parameters and preparing the final query string.
     * @returns {string} - The final SQL query string after appending the parameters.
     */
    build(): string;
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
    /**
     * Closes the connection or pool, ensuring all resources are freed.
     * @returns {Promise<void>} - A promise that resolves when the connection or pool is closed.
     */
    close(): Promise<void>;
}
export default DBnx;
