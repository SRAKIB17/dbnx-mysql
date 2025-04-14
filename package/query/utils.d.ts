import { OperatorType } from "../utils";
import { FindAllParamsType, SortType } from "./find";
export type JoinsType<Tables extends string[]> = Array<{
    operator?: OperatorType | string;
    type?: "JOIN" | "INNER JOIN" | "OUTER JOIN" | "CROSS JOIN" | "RIGHT JOIN" | "LEFT JOIN";
} | {
    on?: string;
    table?: string;
} | {
    [key: string]: string;
} | {
    [P in Tables[number]]?: string;
}>;
export declare function parseSort<Tables extends string[]>(sort: SortType<Tables>): string;
export declare function parseGroupBy<Tables extends string[]>(groupBy: FindAllParamsType<Tables>["groupBy"]): string;
export declare function isTableInJoin(sql: string, tableName: string): boolean;
export declare function parseJoins<Tables extends string[]>(joins: JoinsType<Tables>): string;
export declare function parseColumns<Tables extends string[]>(columns: FindAllParamsType<Tables>["groupBy"]): string;
