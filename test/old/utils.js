"use strict";
// import { FindAllParamsType } from "./find";
// import { JoinsType, SortType } from "./types";
// export function parseSort<Tables extends string[]>(sort: SortType<Tables>): string {
//     if (!sort) return '';
//     // Handle the case where sort is a simple string
//     if (typeof sort === "string") {
//         return ` ORDER BY ${sort}`;
//     }
//     // Handle the case where sort is a Record<string, 1 | -1>
//     if (typeof sort === "object") {
//         let query = '';
//         for (const table in sort) {
//             if (!sort.hasOwnProperty(table)) continue;
//             const columns = (sort as any)[table];
//             if (typeof columns === 'number') {
//                 query += `${query ? ', ' : ''}${table} ${columns === 1 ? "ASC" : "DESC"}`;
//             }
//             else if (typeof columns === "object") {
//                 for (const column in columns) {
//                     if (!columns.hasOwnProperty(column)) continue;
//                     const direction = columns[column];
//                     query += `${query ? ', ' : ''}${table}.${column} ${direction === 1 ? "ASC" : "DESC"}`;
//                 }
//             }
//         }
//         if (query) {
//             return ` ORDER BY ${query}`;
//         }
//     }
//     // if (typeof sort === "object") {
//     //     const entries = Object.entries(sort);
//     //     if (entries.length) {
//     //         const query = entries.map(r => {
//     //             const [table, columns] = r;
//     //             if (typeof columns == 'number') {
//     //                 return `${table} ${columns === 1 ? "ASC" : "DESC"}`
//     //             }
//     //             if (typeof columns === "object") {
//     //                 return Object.entries(columns)?.map(([column, direction]) => `${table}.${column} ${direction === 1 ? "ASC" : "DESC"}`)?.join(", ")
//     //             }
//     //             return ''
//     //         }).filter(Boolean).join(", ");
//     //         return ` ORDER BY ${query}`;
//     //     }
//     // }
//     return '';
// }
// export function parseGroupBy<Tables extends string[]>(
//     groupBy: FindAllParamsType<Tables>["groupBy"]
// ): string {
//     if (!groupBy) return '';
//     // Case 1: `groupBy` is a simple string
//     if (typeof groupBy === "string") {
//         return ` GROUP BY ${groupBy}`;
//     }
//     // Case 2: `groupBy` is an array of strings
//     if (Array.isArray(groupBy)) {
//         return ` GROUP BY ${groupBy.join(", ")}`;
//     }
//     // Case 3: `groupBy` is an object
//     if (typeof groupBy === "object") {
//         let group = '';
//         // Handle table-specific arrays
//         Object.entries(groupBy).forEach(([table, columns]) => {
//             if (table === "extra") {
//                 return group += (group ? ", " : "") + (Array.isArray(columns) ? columns.join(", ") : columns);
//             }; // Skip `extra` field
//             if (Array.isArray(columns)) {
//                 return group += (group ? ", " : "") + columns.map(column => `${table}.${column}`).join(", ");
//             }
//         });
//         return group ? ` GROUP BY ${group}` : '';
//     }
//     return '';
// }
// export function isTableInJoin(sql: string, tableName: string): boolean {
//     // Normalize the SQL string by reducing multiple spaces and converting to lowercase
//     sql = sql.replace(/(--[^\n]*|\/\*[\s\S]*?\*\/)/g, '').toLowerCase().trim();
//     // Convert the tableName to lowercase for case-insensitive comparison
//     const tableNameLower = tableName.toLowerCase();
//     // Regex to check if the table is part of a JOIN clause
//     const joinRegex = new RegExp(`\\bjoin\\s+${tableNameLower}\\s+on\\b`, 'i');
//     // Check if the table is found in a JOIN clause
//     return joinRegex.test(sql);
// }
// export function parseJoins<Tables extends string[]>(
//     joins: JoinsType<Tables>
// ): string {
//     if (!joins || joins.length === 0) return '';
//     let relation = '';
//     joins?.forEach((join: any) => {
//         if ('type' in join) {
//             // Case 1: Join with `type`, `on`, and `operator`
//             const { type, on, operator = '=', ...tables } = join;
//             const tableEntries = Object?.entries(tables || {}).filter(([key]) => key !== "type" && key !== "on" && key !== "operator");
//             if (on && tableEntries?.length) {
//                 const table = join?.table;
//                 // If `on` is explicitly provided, use it directly
//                 return relation += ` ${type} ${table || tableEntries?.[0]?.[0]} ON ${on}`;
//             }
//             if (tableEntries.length !== 2) {
//                 throw new Error(`❌JOIN requires exactly two tables for a relation, but found ${tableEntries.length} or condition not found`);
//             }
//             const [[table1, column1], [table2, column2]] = tableEntries;
//             let primary = isTableInJoin(relation, table1) ? table2 : table1;
//             return relation += ` ${type} ${primary} ON ${table2}.${column2} ${operator} ${table1}.${column1}`;
//         }
//         else {
//             // Case 2: Shorthand form (logging details as requested)
//             const tableEntries = Object.entries(join).filter(([key]) => key !== "type" && key !== "on" && key !== "operator");
//             if ('on' in join && tableEntries?.length) {
//                 const { on, operator = '=', ...tables } = join;
//                 return relation += ` JOIN ${join?.table || tableEntries?.[0]?.[0]} ON ${on}`;
//             }
//             // If there are not exactly 2 table-column pairs, raise an error
//             if (tableEntries.length !== 2) {
//                 throw new Error(`❌ JOIN shorthand requires exactly two tables, but found ${tableEntries.length} or condition not found`);
//             }
//             // Deconstruct the table-column pairs
//             const [[table1, column1], [table2, column2]] = tableEntries;
//             let primary = isTableInJoin(relation, table1) ? table2 : table1;
//             return relation += ` JOIN ${primary} ON ${table2}.${column2} = ${table1}.${column1}`;
//         }
//     });
//     return relation;
// }
// export function parseColumns<Tables extends string[]>(
//     columns: FindAllParamsType<Tables>["groupBy"]
// ): string {
//     if (!columns) return '';
//     // Case 1: `` is a simple string
//     if (typeof columns === "string") {
//         return columns;
//     }
//     // Case 2: `` is an array of strings
//     if (Array.isArray(columns)) {
//         return columns.join(", ");
//     }
//     // Case 3: `` is an object
//     if (typeof columns === "object") {
//         let column = ''
//         // Handle table-specific arrays
//         Object.entries(columns).forEach(([table, columns]) => {
//             if (table === "extra") {
//                 return column += (column ? ", " : "") + (Array.isArray(columns) ? columns.join(", ") : columns);
//             }; // Skip `extra` field
//             if (Array.isArray(columns)) {
//                 return column += (column ? ", " : "") + columns.map(column => `${table}.${column}`).join(", ");
//             }
//         });
//         return column ? column : "";
//     }
//     return '';
// }
