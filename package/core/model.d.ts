import { CreateOptionsType, CreateParamsType, DeleteParamsType, FindAllParamsType, FindOneParamsType, UpdateParamsType } from "../query/index.js";
import { ResponseType } from "../types/index.js";
import { DBnxHandler } from "./handler.js";
import { Attributes, ModelDefine, TableOptions } from "./model-define.js";
type Hooks = Record<string, Function[]>;
type ColumnMetadata = {
    field: string;
    type: string;
    null: "YES" | "NO";
    constraintName: string;
    key: "PRI" | "MUL" | "UNI" | "NULL";
    default: string | null;
    extra: string;
};
export declare class Model extends ModelDefine {
    static hooks: Hooks;
    constructor(attributes: any);
    /**
     * Initializes a model with schema and database information.
     * @param model - Model name in the format `db_name.table_name` or just `table_name`.
     * @param attributes - Schema definition of the model.
     * @param instance - Instance of the database handler (`DBnx`).
     * @param options - Additional table options such as engine, collation, etc.
     * @returns The current `Model` instance.
     */
    static init(model: string, attributes: Attributes, instance: DBnxHandler, options?: TableOptions): typeof Model;
    /**
     * Creates a new record in the database.
     * @param values - Data to insert into the table.
     * @param options - Optional settings for the insertion.
     * @returns The result of the operation as a `ResponseType`.
     */
    static create(values: CreateParamsType<[]>, options?: CreateOptionsType): Promise<ResponseType>;
    /**
     * Retrieves all records that match the provided configuration.
     * @param Config - Configuration for the query (e.g., filters, joins).
     * @returns The query result as a `ResponseType`.
     */
    static findAll<Tables extends string[]>(Config?: FindAllParamsType<Tables>): Promise<ResponseType>;
    /**
     * Retrieves the first record that matches the provided configuration.
     * @param Config - Configuration for the query (e.g., filters, joins).
     * @returns The first matching record as a `ResponseType`.
     */
    static findOne<Tables extends string[]>(Config?: FindOneParamsType<Tables>): Promise<ResponseType>;
    /**
     * Updates records in the table based on the provided criteria.
     * @param Props - Update criteria and data.
     * @returns The result of the update as a `ResponseType`.
     */
    static update<Tables extends string[]>(Props: UpdateParamsType<Tables>): Promise<ResponseType>;
    /**
     * Deletes records from the table based on the provided criteria.
     * @param Props - Criteria for deletion.
     * @returns The result of the deletion as a `ResponseType`.
     */
    static delete<Tables extends string[]>(Props: DeleteParamsType<Tables>): Promise<ResponseType>;
    protected static getColumnMetadata(): Promise<ColumnMetadata[]>;
    protected static listConstraints(): Promise<{
        constraintName: string;
        constraintType: "PRIMARY KEY" | "FOREIGN KEY" | "UNIQUE" | "CHECK" | "DEFAULT" | "NOT NULL";
    }[]>;
    protected static dropTableConstraints(): Promise<void>;
    static drop(): Promise<ResponseType>;
    static sync(force?: boolean): Promise<ResponseType>;
    private static errorHandle;
}
export { };
