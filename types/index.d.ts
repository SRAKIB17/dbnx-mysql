import { Response } from 'express';
import { QueryResult } from 'mysql2';
import { Charset, Collation, Engine } from './engine options';

export * from "./utilities";
export * from "./handler";
export * from "./model";
export * from "./data types";
export * from "./query";
export * from "./engine options";
export * from "./condition";

export type Attributes = Record<string, ColumnOptions>;

export type TableOptions = {
    engine?: Engine;
    charset?: Charset;
    collation?: Collation;
    auto_increment?: number;
};


export type ColumnOptions = {
    modifyColumn?: string,
    type: string;
    allowNull?: boolean;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    onUpdate?: string | "CURRENT_TIMESTAMP";
    defaultValue?: string | number | "CURRENT_TIMESTAMP" | null;
    references?: string | {
        model: string | typeof Model,
        onUpdate?: "CASCADE" | "SET NULL" | "NO ACTION" | "RESTRICT";
        // onUpdate?: "CASCADE" | "SET NULL" | "NO ACTION" | "RESTRICT" | "SET DEFAULT";
        onDelete?: "CASCADE" | "SET NULL" | "NO ACTION" | "RESTRICT";
        key: string; // Referenced column
    };
    unique?: boolean,
    values?: readonly string[],
}

// SuccessResponse type for a successful query or operation
interface SuccessResponse {
    success: true;
    result: QueryResult;    // Query result (can be of any type depending on the query)
    [key: string]: any;
}

// ErrorResponse type for handling errors
interface ErrorResponse {
    result: any;
    errno: any;
    success: boolean;
    error: string;
}
// ResponseType can be one of the three types
export type ResponseType = SuccessResponse & ErrorResponse

