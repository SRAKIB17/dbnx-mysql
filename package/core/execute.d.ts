import { Connection, Pool } from "mysql2/promise";
import { ResponseType } from "../types/index.js";
import { Query } from "./query.js";
export type DB = {
    pool?: Pool;
    connection?: Connection;
};
export declare class Execute {
    #private;
    protected query: string[];
    db: DB;
    ref: Query | null | symbol;
    constructor(db: DB, ref?: Query | symbol | null, query?: string[]);
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
    executeMultiple(sql?: string, params?: string[] | string[][], additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeMultiple(sql?: string, additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeMultiple(sql?: string, additional?: Record<string, any>): Promise<ResponseType>;
    executeMultiple(sql?: string, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeMultiple(sql?: string): Promise<ResponseType>;
    executeMultiple(additional?: Record<string, any>, responseFn?: (data: any) => any): Promise<ResponseType>;
    executeMultiple(additional: Record<string, any>): Promise<any>;
    executeMultiple(responseFn?: (data: any) => any): Promise<ResponseType>;
}
