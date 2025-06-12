"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSort = parseSort;
exports.parseGroupBy = parseGroupBy;
exports.isTableInJoin = isTableInJoin;
exports.parseJoins = parseJoins;
exports.parseColumns = parseColumns;
function parseSort(sort) {
    if (!sort)
        return "";
    if (typeof sort === "string") {
        return ` ORDER BY ${sort}`;
    }
    if (typeof sort === "object") {
        let query = "";
        for (const table in sort) {
            if (!sort.hasOwnProperty(table))
                continue;
            const columns = sort[table];
            if (typeof columns === "number") {
                query += `${query ? ", " : ""}${table} ${columns === 1 ? "ASC" : "DESC"}`;
            }
            else if (typeof columns === "object") {
                for (const column in columns) {
                    if (!columns.hasOwnProperty(column))
                        continue;
                    const direction = columns[column];
                    query += `${query ? ", " : ""}${table}.${column} ${direction === 1 ? "ASC" : "DESC"}`;
                }
            }
        }
        if (query) {
            return ` ORDER BY ${query}`;
        }
    }
    return "";
}
function parseGroupBy(groupBy) {
    if (!groupBy)
        return "";
    if (typeof groupBy === "string") {
        return ` GROUP BY ${groupBy}`;
    }
    if (Array.isArray(groupBy)) {
        return ` GROUP BY ${groupBy.join(", ")}`;
    }
    if (typeof groupBy === "object") {
        let group = "";
        for (const table in groupBy) {
            if (groupBy.hasOwnProperty(table)) {
                const val = groupBy[table];
                if (table === "extra") {
                    let gr = Array.isArray(val) ? val.join(", ") : val;
                    group += (group && gr ? ", " : "") + gr;
                }
                else if (Array.isArray(val)) {
                    group +=
                        (group ? ", " : "") + val.map((c) => `${table}.${c}`).join(", ");
                }
            }
        }
        return group ? ` GROUP BY ${group}` : "";
    }
    return "";
}
function isTableInJoin(sql, tableName) {
    sql = sql
        .replace(/(--[^\n]*|\/\*[\s\S]*?\*\/)/g, "")
        .toLowerCase()
        .trim();
    const tableNameLower = tableName.toLowerCase();
    const joinRegex = new RegExp(`\\bjoin\\s+${tableNameLower}\\s+on\\b`, "i");
    return joinRegex.test(sql);
}
function parseJoins(joins) {
    if (!joins || joins.length === 0)
        return "";
    let relation = "";
    joins?.forEach((join) => {
        const { type, on, operator = "=", ...tables } = join;
        const tableEntries = Object?.entries(tables || {}).filter(([key]) => key !== "type" && key !== "on" && key !== "operator");
        if (type) {
            if (on && tableEntries?.length) {
                const table = join?.table;
                return (relation += ` ${type} ${table || tableEntries?.[0]?.[0]} ON ${on}`);
            }
            if (tableEntries.length !== 2) {
                throw new Error(`❌JOIN requires exactly two tables for a relation, but found ${tableEntries.length} or condition not found`);
            }
            const [[table1, column1], [table2, column2]] = tableEntries;
            let primary = isTableInJoin(relation, table1) ? table2 : table1;
            return (relation += ` ${type} ${primary} ON ${table2}.${column2} ${operator} ${table1}.${column1}`);
        }
        else {
            if ("on" in join && tableEntries?.length) {
                const { on, operator = "=", ...tables } = join;
                return (relation += ` JOIN ${join?.table || tableEntries?.[0]?.[0]} ON ${on}`);
            }
            if (tableEntries.length !== 2) {
                throw new Error(`❌ JOIN shorthand requires exactly two tables, but found ${tableEntries.length} or condition not found`);
            }
            const [[table1, column1], [table2, column2]] = tableEntries;
            let primary = isTableInJoin(relation, table1) ? table2 : table1;
            return (relation += ` JOIN ${primary} ON ${table2}.${column2} ${operator} ${table1}.${column1}`);
        }
    });
    return relation;
}
function parseColumns(columns) {
    if (!columns)
        return "";
    if (typeof columns === "string") {
        return columns;
    }
    if (Array.isArray(columns)) {
        return columns.join(", ");
    }
    if (typeof columns === "object") {
        let selectColumn = "";
        for (const table in columns) {
            if (columns.hasOwnProperty(table)) {
                const col = columns[table];
                if (table === "extra") {
                    let ex = Array.isArray(col) ? col.join(", ") : col;
                    selectColumn +=
                        (selectColumn && ex ? ", " : "") + ex;
                }
                else if (Array.isArray(col)) {
                    selectColumn +=
                        (selectColumn ? ", " : "") +
                            col.map((c) => `${table}.${c}`).join(", ");
                }
            }
        }
        return selectColumn;
    }
    return "";
}
