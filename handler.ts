import { createConnection, createPool } from "mysql2";
import { Connection, ConnectionOptions, Pool, PoolOptions } from 'mysql2/promise';
import { Model } from "./model";
import { TableOptions } from "./model-define";
import { destroy, findingQuery, insertInto, update } from "./query";
import { ColumnOptions, CreateOptionsType, CreateParamsType, DeleteParamsType, Filters, FindAllParamsType, FindOneParamsType, ResponseType, UpdateParamsType } from './types';
import { parseMySQLUrl } from "./utilities";
import { dbnxCondition } from "./utilities/condition";

export class DBnx {
    #pool: Pool | null = null;
    #connection: Connection | null = null;
    #query: string = "";
    #dbConfig: ConnectionOptions | PoolOptions | string | null = null;
    #usePool: boolean = false;
    #logger?: (log: any) => void = undefined;

    constructor(dbConfig: ConnectionOptions | PoolOptions | string, usePool?: boolean, logger?: (log: any) => void)
    constructor(dbConfig: ConnectionOptions | PoolOptions | string, logger?: (log: any) => void)
    constructor(dbConfig: ConnectionOptions | PoolOptions | string)
    constructor(...arg: any[]) {
        this.#logger = typeof arg[1] === 'function' ? arg[1] : arg[2];
        this.#usePool = typeof arg[1] == 'boolean' ? arg[1] : false;
        this.#dbConfig = arg[0];
    }

    /**
     * Establishes a database connection using either a connection pool or a single connection.
     * @param {function} [props] - Optional callback function for success or error handling.
     * @returns {DBnx} - The current instance of DBnx.
     */
    connect(props?: (err?: any, success?: any) => void) {
        try {
            if (this.#usePool) {
                this.#pool = createPool(this.#dbConfig as PoolOptions).promise();
            }
            else {
                this.#connection = createConnection(this.#dbConfig as ConnectionOptions).promise()
            }
            if (props) {
                this.logger_function('✅ Connection has been established successfully.');
                props(undefined, "Connection has been established successfully.")
            }
        }
        catch (error) {
            this.logger_function(`❌ Error: ${error}`);
            if (props) {
                props(error, undefined)
            }
        }
        return this;
    }

    #argumentExecuteParse(...args: any[]) {
        let sql: string | undefined;
        let params: string[] | string[][] | undefined;
        let additional: Record<string, any> | undefined;
        let responseFn: ((data: any) => any) | undefined;


        if (args.length === 4) {
            [sql, params, additional, responseFn] = args;
        } else if (args.length === 3) {
            if (typeof args[0] === "string" && Array.isArray(args[1])) {
                [sql, params, additional] = args;
            } else {
                [sql, additional, responseFn] = args;
            }
        } else if (args.length === 2) {
            if (typeof args[0] === "string") {
                sql = args[0];
                if (Array.isArray(args[1])) {
                    params = args[1];
                }
                else if (typeof args[1] === "object") {
                    additional = args[1];
                }
                else if (typeof args[1] === "function") {
                    responseFn = args[1];
                }
            }
            else {
                additional = args[0];
                responseFn = args[1];
            }
        }
        else if (args.length === 1) {
            if (typeof args[0] == 'string') {
                sql = args[0]
            }
            else if (typeof args[0] === "function") {
                responseFn = args[0];
            } else if (typeof args[0] === "object") {
                additional = args[0];
            }
        }

        return { sql, params, additional, responseFn };
    }

    /**
     * Executes the provided SQL query with the given parameters and optional additional data.
     * @param {string} [sql] - The SQL query string to be executed.
     * @param {string[] | string[][]} [params] - Optional parameters for the SQL query.
     * @param {Record<string, any>} [additional] - Optional additional data to be included in the response.
     * @param {function} [responseFn] - Optional callback function to handle the response.
     * @returns {Promise<ResponseType>} - A promise resolving to the response data.
     */
    public async execute(
        sql?: string,
        params?: string[] | string[][],
        additional?: Record<string, any>,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async execute(
        sql?: string,
        additional?: Record<string, any>,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async execute(
        sql?: string,
        additional?: Record<string, any>,
    ): Promise<ResponseType>;

    public async execute(
        sql?: string,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async execute(
        sql?: string,
    ): Promise<ResponseType>;

    public async execute(
        additional?: Record<string, any>,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async execute(
        additional: Record<string, any>,
    ): Promise<ResponseType>;

    public async execute(
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;


    public async execute(...args: any[]) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args)

        const query = sql || this.#query;
        this.logger_function(`🔍 Execute: ${query}`);

        if (!query) {
            throw new Error("No query to execute.");
        }

        let connection: Connection | undefined;
        if (this.#pool) {
            connection = await this.#pool?.getConnection();
        }
        else if (this.#connection) {
            connection = this.#connection
        }
        else {
            throw new Error('Database connection is not initialized.');
        }
        try {
            const [rows, fields] = await connection?.execute(query, params);
            const data = {
                success: true,
                result: rows,
                ...additional,
            };
            if (responseFn) {
                return responseFn(data);
            }
            return data;
        }
        catch (err: any) {
            const errorData: any = {
                result: [],
                errno: err?.errno,
                success: false,
                error: err instanceof Error ? err.message : String(err),
            };
            if (responseFn) {
                return responseFn(errorData);
            }
            return errorData;
        }
        finally {
            this.#query = ''
            if (this.#pool && connection !== this.#connection && connection) {
                await (connection as any).release();
            }
        }
    }

    /**
     * Executes the provided SQL query with the given parameters and optional additional data, using the query method.
     * @param {string} [sql] - The SQL query string to be executed.
     * @param {string[] | string[][]} [params] - Optional parameters for the SQL query.
     * @param {Record<string, any>} [additional] - Optional additional data to be included in the response.
     * @param {function} [responseFn] - Optional callback function to handle the response.
     * @returns {Promise<ResponseType>} - A promise resolving to the response data.
     */
    public async executeQuery(
        sql?: string,
        params?: string[] | string[][],
        additional?: Record<string, any>,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async executeQuery(
        sql?: string,
        additional?: Record<string, any>,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async executeQuery(
        sql?: string,
        additional?: Record<string, any>,
    ): Promise<ResponseType>;

    public async executeQuery(
        sql?: string,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async executeQuery(
        sql?: string,
    ): Promise<ResponseType>;

    public async executeQuery(
        additional?: Record<string, any>,
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;

    public async executeQuery(
        additional: Record<string, any>,
    ): Promise<any>;

    public async executeQuery(
        responseFn?: (data: any) => any
    ): Promise<ResponseType>;


    public async executeQuery(...args: any[]) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args)
        const query = sql || this.#query;

        this.logger_function(`📜 Execute: ${query}`);

        if (!query) {
            throw new Error("No query to execute.");
        }

        let connection: Connection | undefined;
        if (this.#pool) {
            connection = await this.#pool?.getConnection();
        }
        else if (this.#connection) {
            connection = this.#connection
        }
        else {
            throw new Error('Database connection is not initialized.');
        }
        try {
            const [rows, fields] = await connection?.query(query, params);
            const data = {
                success: true,
                result: rows,
                ...additional,
            };
            if (responseFn) {
                return responseFn(data);
            }
            return data;
        }
        catch (err: any) {
            const errorData: any = {
                result: [],
                errno: err?.errno,
                success: false,
                error: err instanceof Error ? err.message : String(err),
            };
            if (responseFn) {
                return responseFn(errorData);
            }
            return errorData;
        }
        finally {
            this.#query = ''
            if (this.#pool && connection !== this.#connection && connection) {
                await (connection as any).release();
            }
        }
    }

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
    ) {
        const model = class extends Model {
        };
        Object.defineProperty(model, 'name', { value: modelName });
        model.init(modelName, attributes, this, options);
        return model;
    }

    /**
     * Creates a new record in the specified table or model.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {CreateParamsType} values - The values to be inserted into the table/model.
     * @param {CreateOptionsType} [options] - Optional configuration for the insertion.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    create(table: string, values: CreateParamsType<[]>, options?: CreateOptionsType): DBnx;
    create(model: typeof Model, values: CreateParamsType<[]>, options?: CreateOptionsType): Promise<ResponseType>;
    create(...args: any): DBnx | Promise<ResponseType> {

        if (args?.length < 2) {
            throw new Error(
                "No arguments provided to 'findFrom'. Expected a table name and/or values."
            );
        }

        const values = args[1]
        const options = args[2] ?? {}

        if (typeof args[0] === 'function' && 'tableName' in args[0]) {
            return (args[0] as typeof Model).create(values, options);
        }

        let table = typeof args[0] === 'string' ? args[0] : '';
        if (!table) {
            throw new Error("Expected a table name and/or values.");
        }
        this.#query += insertInto(table, values, options);
        this.logger_function(`🆕 Create into: \`${table}\``);
        return this
    }
    /**
     * Retrieves all records from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindAllParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */

    public findAll<Tables extends string[]>(table: string, Config?: FindAllParamsType<Tables>): DBnx;
    public findAll<Tables extends string[]>(model: typeof Model, Config?: FindAllParamsType<Tables>): Promise<ResponseType>;
    public findAll<Tables extends string[]>(...args: any): DBnx | Promise<ResponseType> {

        if (args.length === 0) {
            throw new Error("No arguments provided to 'findAll'. Expected a table name or model.");
        }

        let table: string = '';
        let Config: Record<string, any> = args[1] ?? {};

        if (typeof args[0] === "function" && "tableName" in args[0]) {

            table = args[0].model;
            return (args[0] as typeof Model).findAll<Tables>(Config)
        }

        if (typeof args[0] === "string") {

            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += findingQuery<Tables>(table, Config)
        this.logger_function(`📋 Find all from: \`${table}\``);
        return this
    }

    /**
      * Retrieves a single record from the specified table or model based on the provided configuration.
      * @param {string | typeof Model} tableOrModel - The table name or the model class.
      * @param {FindOneParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
      * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
      */
    public findOne<Tables extends string[]>(table: string, Config?: FindOneParamsType<Tables>): DBnx;
    public findOne<Tables extends string[]>(model: typeof Model, Config?: FindOneParamsType<Tables>): Promise<ResponseType>;
    public findOne<Tables extends string[]>(...args: any): DBnx | Promise<ResponseType> {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findOne'. Expected a table name or model.");
        }

        let table: string = '';
        let Config: Record<string, any> = args[1] ?? {};
        Config.limitSkip = { limit: 1 };
        if (typeof args[0] === "function" && "tableName" in args[0]) {

            table = args[0].model;
            return (args[0] as typeof Model).findOne<Tables>(Config)
        }

        if (typeof args[0] === "string") {

            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += findingQuery<Tables>(table, Config)
        this.logger_function(`🔎 Find one from: \`${table}\``);
        return this
    }

    /**
    * Updates an existing record in the specified table with the provided properties.
    * @param {string} table - The table to update.
    * @param {UpdateParamsType} Props - The properties to update in the record.
    * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
    */
    public update<Tables extends string[]>(table: string, Props: UpdateParamsType<Tables>): DBnx;
    public update<Tables extends string[]>(model: typeof Model, Props: UpdateParamsType<Tables>): Promise<ResponseType>;
    public update<Tables extends string[]>(...args: any): DBnx | Promise<ResponseType> {

        if (args.length === 0) {
            throw new Error("No arguments provided to 'update'. Expected a table name or model.");
        }

        let table: string = '';
        let Props = args[1];

        if (typeof args[0] === "function" && "tableName" in args[0]) {
            table = args[0].model;
            return (args[0] as typeof Model).update<Tables>(Props)
        }

        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += update<Tables>(table, Props)
        this.logger_function(`✏️ Update from: \`${table}\``);
        return this
    }

    /**
     * Deletes a record from the specified table based on the provided parameters.
     * @param {string} table - The table from which to delete the record.
     * @param {DeleteParamsType} conditions - The conditions to match for deleting the record(s).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    public delete<Tables extends string[]>(table: string, Props: DeleteParamsType<Tables>): DBnx;
    public delete<Tables extends string[]>(model: typeof Model, Props: DeleteParamsType<Tables>): Promise<ResponseType>;
    public delete<Tables extends string[]>(...args: any): DBnx | Promise<ResponseType> {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'delete'. Expected a table name or model.");
        }
        let table: string = '';
        let Props = args[1] ?? {};

        if (typeof args[0] === "function" && "tableName" in args[0]) {
            table = args[0].model;
            return (args[0] as typeof Model).delete<Tables>(Props)
        }
        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += destroy<Tables>(table, Props)
        this.logger_function(`🗑️ Delete from: \`${table}\``);
        return this;
    }

    logger_function(log: any) {
        if (this.#logger) {
            this.#logger(log)
        }
    }
    /**
     * Fetch all configurations used in the connection or pool.
     * @returns Object containing configuration details.
     */
    public getConfig(): ConnectionOptions | PoolOptions | null {
        let option
        if (this.#pool) {
            option = (this.#pool?.pool.config as any).connectionConfig
        }
        else if (this.#connection) {
            option = (this.#connection as any).config;  // Return the config of the single connection
        }
        if (option) {
            return option
        }
        if (typeof this.#dbConfig == 'string') {
            return parseMySQLUrl(this.#dbConfig);
        }
        return this.#dbConfig;
    }


    /**
   * Sets the SQL query string that will be executed later.
   * @param {string} sql - The SQL query string to be set.
   * @returns {DBnx} - The current instance of DBnx for method chaining.
   */
    public setQuery(query: string) {
        this.logger_function(`⚙️ Query set: ${query}`);
        this.#query = query;
        return this
    }
    /**
      * Builds the SQL query string by appending parameters and preparing the final query string.
      * @returns {string} - The final SQL query string after appending the parameters.
      */
    public build(): string {
        const build_query = this.#query;
        this.#query = '';
        return build_query;
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
    public condition(filters: Filters, joinBy: 'AND' | 'OR' = 'AND'): string {
        return dbnxCondition(filters, joinBy);
    }

    /**
   * Closes the connection or pool, ensuring all resources are freed.
   * @returns {Promise<void>} - A promise that resolves when the connection or pool is closed.
   */
    public async close(): Promise<void> {
        // Check if there's a pool of connections
        if (this.#pool) {
            // Log that the pool is being closed
            this.logger_function('⏳ Closing connection pool...');
            await this.#pool.end();  // Gracefully close the pool
            this.logger_function('✅ Connection pool closed successfully.');
        }
        // If there’s a single connection
        else if (this.#connection) {
            // Log that the connection is being closed
            this.logger_function('⏳ Closing database connection...');
            await this.#connection.end();  // Gracefully close the connection
            this.logger_function('✅ Database connection closed successfully.');
        } else {
            // Log if no pool or connection exists
            this.logger_function('⚠️ No active connection or pool to close.');
        }
    }
}

export default DBnx;