import { JoinsType, SortType } from "./types";
import { parseJoins, parseSort } from "./utils";

export interface DeleteParamsType<Tables extends string[]> {
    where: string;
    sort?: SortType<Tables>;
    limit?: string | number;
    joins?: JoinsType<Tables>;
}


export function destroy<Tables extends string[]>(table: string, { where, joins, limit, sort, }: DeleteParamsType<Tables>) {
    // Ensure required parameters are provided
    if (!table) {
        throw new Error("⚠️ The `table` parameter is required.");
    }
    if (!where) {
        throw new Error("⚠️ The `where` parameter is required.");
    }

    // Base query for DELETE
    let query = `DELETE ${table} FROM ${table}`;

    // Add joins if provided
    query += joins ? parseJoins(joins) : "";

    // Add condition if specified (WHERE clause)
    if (where) {
        query += ` WHERE ${where}`;
    }

    // Add sorting if provided
    if (sort) {
        query += parseSort(sort);
    }
    // Add LIMIT if provided
    if (limit) {
        query += ` LIMIT ${limit}`;
    }

    return `${query};`;
}