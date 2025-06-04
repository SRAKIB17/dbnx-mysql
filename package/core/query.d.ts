import { CreateOptionsType, CreateParamsType, DeleteParamsType, FindAllParamsType, FindOneParamsType, UpdateParamsType } from "../query/index.js";
import { ResponseType } from "../types/index.js";
import { DB, Execute } from "./execute.js";
import { Model } from "./model.js";
export declare class Query extends Execute {
    constructor(db?: DB, ref?: Query | symbol | null, q?: string[]);
    protected _chain(actionObj: string): Query;
    /**
     * Creates a new record in the specified table or model.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {CreateParamsType} values - The values to be inserted into the table/model.
     * @param {CreateOptionsType} [options] - Optional configuration for the insertion.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    create(table: string, values: CreateParamsType<[]>, options?: CreateOptionsType): Query;
    create(model: typeof Model, values: CreateParamsType<[]>, options?: CreateOptionsType): Promise<ResponseType>;
    /**
     * Retrieves all records from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindAllParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    findAll<Tables extends string[]>(table: string, Config?: FindAllParamsType<Tables>): Query;
    findAll<Tables extends string[]>(model: typeof Model, Config?: FindAllParamsType<Tables>): Promise<ResponseType>;
    /**
     * Retrieves a single record from the specified table or model based on the provided configuration.
     * @param {string | typeof Model} tableOrModel - The table name or the model class.
     * @param {FindOneParamsType} [Config] - Optional configurations for the query (e.g., filtering, sorting).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    findOne<Tables extends string[]>(table: string, Config?: FindOneParamsType<Tables>): Query;
    findOne<Tables extends string[]>(model: typeof Model, Config?: FindOneParamsType<Tables>): Promise<ResponseType>;
    /**
     * Updates an existing record in the specified table with the provided properties.
     * @param {string} table - The table to update.
     * @param {UpdateParamsType} Props - The properties to update in the record.
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    update<Tables extends string[]>(table: string, Props: UpdateParamsType<Tables>): Query;
    update<Tables extends string[]>(model: typeof Model, Props: UpdateParamsType<Tables>): Promise<ResponseType>;
    /**
     * Deletes a record from the specified table based on the provided parameters.
     * @param {string} table - The table from which to delete the record.
     * @param {DeleteParamsType} conditions - The conditions to match for deleting the record(s).
     * @returns {DBnx | Promise<ResponseType>} - The current DBnx instance or a promise with the response data.
     */
    delete<Tables extends string[]>(table: string, Props: DeleteParamsType<Tables>): Query;
    delete<Tables extends string[]>(model: typeof Model, Props: DeleteParamsType<Tables>): Promise<ResponseType>;
    /**
     * Sets the SQL query string that will be executed later.
     * @param {string} sql - The SQL query string to be set.
     * @returns {this} - The current instance of DBnx for method chaining.
     */
    setQuery(query: string): Query;
    build(): string;
}
