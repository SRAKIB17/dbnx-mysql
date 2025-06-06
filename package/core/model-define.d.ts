import { ColumnOptions } from "../types/index.js";
import { Charset, Collation, Engine } from "../types/engine_options.js";
import { DBnxHandler } from "./handler.js";
export type TableOptions = {
    engine?: Engine;
    charset?: Charset;
    collation?: Collation;
    auto_increment?: number;
};
export type Attributes = Record<string, ColumnOptions>;
export declare class ModelDefine {
    static database?: string;
    static ddlQuery: string;
    static modelAttributes: Attributes;
    static tableOptions: TableOptions;
    static dbInstance: DBnxHandler;
    static tableName: string;
    static dbTableIdentifier: string;
    static generateDDL(attributes: Attributes): void;
    protected static generateColumnsSQL(attributes: Attributes, isAlter?: boolean): string;
    static getEngineOptions(): string;
}
