import { parseColumns, parseGroupBy, parseJoins, parseSort, } from "./utils";
let aggregates_alias = {
    MIN: "minimum",
    MAX: "maximum",
    SUM: "summation",
    COUNT: "count",
    AVG: "average",
};
export function find(table, config = {}) {
    const { distinct, sort, limitSkip, columns, subQueries, groupBy, recursiveCTE, aggregates, where, having, joins, } = config;
    let main_table = table;
    let recursiveCTEQuery = "";
    if (recursiveCTE) {
        const { baseCase, recursiveCase, alias } = recursiveCTE;
        recursiveCTEQuery = `WITH RECURSIVE ${alias} AS (
            ${baseCase}
            UNION ALL
            ${recursiveCase}
        ) `;
        main_table = alias;
    }
    let query = `${recursiveCTEQuery}SELECT `;
    if (distinct) {
        query += "DISTINCT ";
    }
    let select = "";
    if (columns) {
        select = parseColumns(columns);
    }
    if (subQueries) {
        const subQueryStatement = subQueries
            .map((subQuery) => {
            return `(${subQuery.query})${subQuery.as ? ` AS ${subQuery.as}` : ""}`;
        })
            .join(", ");
        select += `${select ? ", " : ""} ${subQueryStatement}`;
    }
    if (aggregates) {
        const aggStrings = aggregates.map((agg) => {
            const { alias, ...functions } = agg;
            let functionStr = "";
            for (const func in functions) {
                if (!functions.hasOwnProperty(func))
                    continue;
                const column = functions[func];
                const aliasName = alias
                    ? alias
                    : aggregates_alias[func] || func;
                functionStr += `${functionStr ? ", " : ""}${func}(${column}) AS ${aliasName}`;
            }
            return functionStr;
        });
        select += `${select ? ", " : ""}${aggStrings.join(", ")}`;
    }
    query += `${select ? select : "*"} FROM ${main_table}`;
    if (joins) {
        query += parseJoins(joins);
    }
    if (where) {
        query += ` WHERE ${where}`;
    }
    if (groupBy) {
        query += parseGroupBy(groupBy) || "";
    }
    if (having) {
        query += ` HAVING ${having}`;
    }
    if (sort) {
        query += parseSort(sort);
    }
    if (limitSkip) {
        if (limitSkip.limit) {
            query += ` LIMIT ${limitSkip.limit}`;
        }
        if (limitSkip.skip) {
            query += ` OFFSET ${limitSkip.skip}`;
        }
    }
    return `${query.trim()};`;
}
