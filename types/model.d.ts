import { DBnx } from "./handler";
import { Attributes, ResponseType, TableOptions } from "./index";

import {
    CreateOptionsType,
    CreateParamsType,
    DeleteParamsType,
    FindAllParamsType,
    FindOneParamsType,
    UpdateParamsType
} from "./query";


// Manages models and their database operations
export class Model {

    static database?: string;
    static ddlQuery: string = '';
    static modelAttributes: Attributes;
    static tableOptions: TableOptions;
    static dbInstance: DBnx;
    static tableName: string;
    static dbTableIdentifier: string

    /**
     * Initializes a model with schema and database information.
     * @param model - Model name in the format `db_name.table_name` or just `table_name`.
     * @param attributes - Schema definition of the model.
     * @param instance - Instance of the database handler (`DBnx`).
     * @param options - Additional table options such as engine, collation, etc.
     * @returns The current `Model` instance.
     */
    static init(
        model: string,
        attributes: Attributes,
        instance: DBnx,
        options?: TableOptions
    ): typeof Model;

    /**
     * Creates a new record in the database.
     * @param values - Data to insert into the table.
     * @param options - Optional settings for the insertion.
     * @returns The result of the operation as a `ResponseType`.
     */
    static create(
        values: CreateParamsType<[]>,
        options?: CreateOptionsType
    ): Promise<ResponseType>;

    /**
     * Retrieves all records that match the provided configuration.
     * @param Config - Configuration for the query (e.g., filters, joins).
     * @returns The query result as a `ResponseType`.
     */
    static findAll<tables extends string[]>(
        Config?: FindAllParamsType<tables>
    ): Promise<ResponseType>;

    /**
     * Retrieves the first record that matches the provided configuration.
     * @param Config - Configuration for the query (e.g., filters, joins).
     * @returns The first matching record as a `ResponseType`.
     */
    static findOne<tables extends string[]>(
        Config?: FindOneParamsType<tables>
    ): Promise<ResponseType>;

    /**
     * Updates records in the table based on the provided criteria.
     * @param Props - Update criteria and data.
     * @returns The result of the update as a `ResponseType`.
     */
    static update<tables extends string[]>(
        Props: UpdateParamsType<tables>
    ): Promise<ResponseType>;

    /**
     * Deletes records from the table based on the provided criteria.
     * @param Props - Criteria for deletion.
     * @returns The result of the deletion as a `ResponseType`.
     */
    static delete<tables extends string[]>(
        Props: DeleteParamsType<tables>
    ): Promise<ResponseType>;


    /**
     * Drops the table if it exists.
     * @returns The result of the operation as a `ResponseType`.
     */
    static drop(): Promise<ResponseType>;

    /**
     * Synchronizes the model with the database table.
     * @param force - If `true`, recreates the table by dropping existing data.
     * @returns The result of the operation as a `ResponseType`.
     */
    static sync(force?: boolean): Promise<ResponseType>;
}