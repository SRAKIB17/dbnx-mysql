import { Connection, Pool, ConnectionOptions, PoolOptions } from 'mysql2/promise';
import { Model } from './model';
import { ColumnOptions, ResponseType, TableOptions, CreateOptionsType, CreateParamsType, DeleteParamsType, FindAllParamsType, FindOneParamsType, UpdateParamsType, } from './index';

export class DBnx {
    #pool: Pool | null = null;
    #connection: Connection | null = null;
    #query: string = ""; // Store the current query
    #dbConfig: ConnectionOptions | PoolOptions | string | null = null;
    #usePool: boolean = false;

    constructor(dbConfig: ConnectionOptions | PoolOptions | string, usePool?: boolean, logger?: (log: any) => void)
    constructor(dbConfig: ConnectionOptions | PoolOptions | string, logger?: (log: any) => void)
    constructor(dbConfig: ConnectionOptions | PoolOptions | string)
    constructor(...arg: any[]);
    /**
     * Establishes a database connection using either a connection pool or a single connection.
     * @param {function} [props] - Optional callback function for success or error handling.
     * @returns {DBnx} - The current instance of DBnx.
     */
    connect(props?: (err?: any, success?: any) => void): DBnx;

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
        additional?: Record<string, any>
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
        additional?: Record<string, any>
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
        options?: TableOptions
    ): typeof Model;

    /**
     * Creates a new record in the specified table or model.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {CreateParamsType} values - The values to be inserted into the table/model.
     * @param {CreateOptionsType} [options] - Optional configuration for the insertion.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    create(
        table: string,
        values: CreateParamsType,
        options?: CreateOptionsType
    ): DBnx;

    public create(
        model: typeof Model,
        values: CreateParamsType,
        options?: CreateOptionsType
    ): Promise<ResponseType>;

    /**
     * Retrieves all records from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindAllParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    public findAll<Tables extends string[]>(
        table: string,
        Config?: FindAllParamsType<Tables>
    ): DBnx;

    public findAll<Tables extends string[]>(
        model: typeof Model,
        Config?: FindAllParamsType<Tables>
    ): Promise<ResponseType>;


    /**
     * Retrieves a single record from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindOneParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    public findOne<Tables extends string[]>(
        table: string,
        Config?: FindOneParamsType<Tables>
    ): DBnx;

    public findOne<Tables extends string[]>(
        model: typeof Model,
        Config?: FindOneParamsType<Tables>
    ): Promise<ResponseType>;


    /**
     * Updates an existing record in the specified table with the provided properties.
     * @param {string} table - The table to update.
     * @param {UpdateParamsType} Props - The properties to update in the record.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    public update<Tables extends string[]>(
        table: string,
        Props: UpdateParamsType<Tables>,
    ): DBnx;

    public update<Tables extends string[]>(
        model: typeof Model,
        Props: UpdateParamsType<Tables>,
    ): Promise<ResponseType>;


    /**
     * Deletes a record from the specified table based on the provided parameters.
     * @param {string} table - The table from which to delete the record.
     * @param {DeleteParamsType} conditions - The conditions to match for deleting the record(s).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    public delete<Tables extends string[]>(table: string, conditions: DeleteParamsType<Tables>): DBnx;
    public delete<Tables extends string[]>(model: typeof Model, conditions: DeleteParamsType<Tables>): Promise<ResponseType>;

    /**
    * Fetch all configurations used in the connection or pool.
    * @returns Object containing configuration details.
    */  /**
     * Sets the SQL query string that will be executed later.
     * @param {string} sql - The SQL query string to be set.
     * @returns {DBnx} - The current instance of DBnx for method chaining.
     */
    public getConfig(): ConnectionOptions | PoolOptions | null

    /**
     * Sets the SQL query string that will be executed later.
     * @param {string} sql - The SQL query string to be set.
     * @returns {DBnx} - The current instance of DBnx for method chaining.
     */
    public setQuery(query: string) {
        this.#query = query;
        return this
    }

    /**
       * Builds the SQL query string by appending parameters and preparing the final query string.
       * @returns {string} - The final SQL query string after appending the parameters.
       */
    public build(): string

    /**
   * Closes the connection or pool, ensuring all resources are freed.
   * @returns {Promise<void>} - A promise that resolves when the connection or pool is closed.
   */
    public async close(): Promise<void>
}
