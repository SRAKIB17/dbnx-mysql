import { createConnection } from "mysql2";
import mysql, { Connection, ConnectionOptions, Pool, PoolOptions } from 'mysql2/promise';
import { ResponseType } from '../../type';
import { Model } from "./model";
import { TableOptions } from "./model-define";
import { CreateOptionsType, CreateParamsType, DeleteParamsType, destroy, FindAllParamsType, findingQuery, FindOneParamsType, insertInto, update, UpdateParamsType } from "./query";
import { ColumnOptions } from "./types";


export class DBnx {
    #pool: Pool | null = null;
    #connection: Connection | null = null;
    #query: string = ""; // Store the current query
    #dbConfig: ConnectionOptions | PoolOptions | string | null = null;
    #usePool: boolean = false;

    constructor(dbConfig: ConnectionOptions | PoolOptions | string, usePool: boolean = false) {
        this.#usePool = usePool;
        this.#dbConfig = dbConfig;
    }

    connect(props?: (err?: any, success?: any) => void) {
        try {
            if (this.#usePool) {
                this.#pool = mysql.createPool(this.#dbConfig as PoolOptions);
            }
            else {
                this.#connection = createConnection(this.#dbConfig as ConnectionOptions).promise()
            }
            if (props) {
                props(undefined, "Connection has been established successfully.")
            }
        }
        catch (error) {
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

        // Argument parsing logic
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

    // Implementation
    public async execute(...args: any[]) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args)

        const query = sql || this.#query;

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

    // Implementation
    public async executeQuery(...args: any[]) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args)
        const query = sql || this.#query;

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
     * Defines a model using the provided model name, attributes, and options.
     * 
     * @param {string} modelName - The name of the model (e.g., "users").
     *                             This name will be used for various internal and external purposes, including table names and query generation.
     * @param {Record<string, ColumnOptions>} attributes - A record object representing the model's columns and their configurations.
     *                                                    The keys are the column names, and the values are the column options (e.g., type, unique, default value).
     * @param {TableOptions} [options] - Optional configuration for the table, such as indexes, foreign key relationships, and other table constraints.
     * 
     * @returns {typeof Model} The defined model class, which can be used to perform CRUD operations on the corresponding database table.
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

        if (typeof args[0] === 'function' && 'model' in args[0]) {
            return (args[0] as typeof Model).create(values, options);
        }

        let table = typeof args[0] === 'string' ? args[0] : '';
        if (!table) {
            throw new Error("Expected a table name and/or values.");
        }
        this.#query += insertInto(table, values, options);
        return this
    }

    public findAll<tables extends string[]>(table: string, Config?: FindAllParamsType<tables>): DBnx;
    public findAll<tables extends string[]>(model: typeof Model, Config?: FindAllParamsType<tables>): Promise<ResponseType>;
    public findAll(...args: any): DBnx | Promise<ResponseType> {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findAll'. Expected a table name or model.");
        }

        let table: string = '';
        let Config: Record<string, any> = args[1] ?? {};

        if (typeof args[0] === "function" && "model" in args[0]) {
            // Case 2: First argument is a Model class
            table = args[0].model;
            return (args[0] as typeof Model).findAll(Config)
        }

        if (typeof args[0] === "string") {
            // Case 1: First argument is a table name
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += findingQuery(table, Config)
        return this
    }

    public findOne<tables extends string[]>(table: string, Config?: FindOneParamsType<tables>): DBnx;
    public findOne<tables extends string[]>(model: typeof Model, Config?: FindOneParamsType<tables>): Promise<ResponseType>;
    public findOne(...args: any): DBnx | Promise<ResponseType> {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findOne'. Expected a table name or model.");
        }

        let table: string = '';
        let Config: Record<string, any> = args[1] ?? {};
        Config.limitSkip = { limit: 1 };
        if (typeof args[0] === "function" && "model" in args[0]) {
            // Case 2: First argument is a Model class
            table = args[0].model;
            return (args[0] as typeof Model).findOne(Config)
        }

        if (typeof args[0] === "string") {
            // Case 1: First argument is a table name
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += findingQuery(table, Config)
        return this
    }


    public update<tables extends string[]>(table: string, Props: UpdateParamsType<tables>): DBnx;
    public update<tables extends string[]>(model: typeof Model, Props: UpdateParamsType<tables>): Promise<ResponseType>;
    public update(...args: any): DBnx | Promise<ResponseType> {

        if (args.length === 0) {
            throw new Error("No arguments provided to 'update'. Expected a table name or model.");
        }

        let table: string = '';
        let Props = args[1];

        if (typeof args[0] === "function" && "model" in args[0]) {
            table = args[0].model;
            return (args[0] as typeof Model).update(Props)
        }

        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += update(table, Props)
        return this
    }

    public delete<tables extends string[]>(table: string, Props: DeleteParamsType<tables>): DBnx;
    public delete<tables extends string[]>(model: typeof Model, Props: DeleteParamsType<tables>): Promise<ResponseType>;
    public delete(...args: any): DBnx | Promise<ResponseType> {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'delete'. Expected a table name or model.");
        }
        let table: string = '';
        let Props = args[1] ?? {};

        if (typeof args[0] === "function" && "model" in args[0]) {
            table = args[0].model;
            return (args[0] as typeof Model).delete(Props)
        }
        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += destroy(table, Props)
        return this;
    }

    /**
     * Fetch all configurations used in the connection or pool.
     * @returns Object containing configuration details.
     */
    public getConfig(): ConnectionOptions | PoolOptions | null {
        if (this.#pool) {
            return this.#pool.config;
        }
        else if (this.#connection) {
            return (this.#connection as any).config;
        }
        return null;
    }
    public setQuery(query: string) {
        this.#query = query;
        return this
    }
    // Build method that returns the query and resets it
    public build(): string {
        const build_query = this.#query;  // Store the current query in `x`
        this.#query = '';  // Reset the query
        return build_query;  // Return the original query
    }

    public async close(): Promise<void> {
        if (this.#pool) {
            await this.#pool.end();
        }
        else if (this.#connection) {
            await this.#connection.end();
        }
    }
}
