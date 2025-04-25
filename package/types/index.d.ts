import { QueryResult } from "mysql2";
import { Model } from "../core/model.js";
import { Charset, Collation, Engine } from "./engine_options.js";
export type Attributes = Record<string, ColumnOptions>;
export type TableOptions = {
    engine?: Engine;
    charset?: Charset;
    collation?: Collation;
    auto_increment?: number;
};
export type ColumnOptions = {
    modifyColumn?: string;
    type: string;
    allowNull?: boolean;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    onUpdate?: string | "CURRENT_TIMESTAMP";
    defaultValue?: string | number | "CURRENT_TIMESTAMP" | null;
    references?: string | {
        model: string | typeof Model;
        onUpdate?: "CASCADE" | "SET NULL" | "NO ACTION" | "RESTRICT";
        onDelete?: "CASCADE" | "SET NULL" | "NO ACTION" | "RESTRICT";
        key: string;
    };
    unique?: boolean;
    values?: readonly string[];
};
interface SuccessResponse {
    success: true;
    result: QueryResult;
    [key: string]: any;
}
interface ErrorResponse {
    result: any;
    errno: any;
    success: boolean;
    error: string;
}
export type ResponseType = SuccessResponse & ErrorResponse;
export {};
