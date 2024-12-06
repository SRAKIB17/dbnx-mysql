"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findingQuery = findingQuery;
const utils_1 = require("./utils");
let aggregates_alias = {
    'MIN': 'minimum',
    'MAX': 'maximum',
    'SUM': 'summation',
    'COUNT': 'count',
    'AVG': 'average'
};
function findingQuery(table, config = {}) {
    const { distinct, sort, limitSkip, columns, subQueries, groupBy, recursiveCTE, aggregates, where, having, joins, } = config;
    let main_table = table;
    let recursiveCTEQuery = '';
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
    //! DISTINCT
    if (distinct) {
        query += "DISTINCT ";
    }
    let select = '';
    //! SELECT Columns
    if (columns) {
        select = (0, utils_1.parseColumns)(columns);
    }
    if (subQueries) {
        const subQueryStatement = subQueries
            .map(subQuery => {
            // Build the subquery string with optional alias
            return `(${subQuery.query})${subQuery.as ? ` AS ${subQuery.as}` : ""}`;
        })
            .join(", ");
        select += `${select ? ", " : ""} ${subQueryStatement}`;
    }
    if (aggregates) {
        const aggStrings = aggregates.map((agg) => {
            const { alias, ...functions } = agg; // Destructure the alias and the function
            // Handle the case where there's an alias
            if (alias) {
                const functionStr = Object.entries(functions)
                    .map(([func, column]) => `${func}(${column})`)
                    .join(", ");
                return `${functionStr} AS ${alias}`;
            }
            // Handle case where there's no alias
            const functionStr = Object.entries(functions)
                .map(([func, column]) => {
                return `${func}(${column}) AS ${aggregates_alias[func] || func}`;
            }).join(", ");
            return functionStr;
        });
        select += `${select ? ", " : ""}${aggStrings.join(", ")}`;
    }
    //! FROM Clause
    query += `${select ? select : "*"} FROM ${main_table}`;
    //! Joins
    if (joins) {
        query += (0, utils_1.parseJoins)(joins);
    }
    //! WHERE Clause
    if (where) {
        query += ` WHERE ${where}`;
    }
    //! GROUP BY Clause
    if (groupBy) {
        query += (0, utils_1.parseGroupBy)(groupBy) || "";
    }
    //! HAVING Clause
    if (having) {
        query += ` HAVING ${having}`;
    }
    //! ORDER BY Clause
    if (sort) {
        query += (0, utils_1.parseSort)(sort);
    }
    //! LIMIT and OFFSET
    if (limitSkip) {
        if (limitSkip.limit) {
            query += ` LIMIT ${limitSkip.limit}`;
        }
        if (limitSkip.skip) {
            query += ` OFFSET ${limitSkip.skip}`;
        }
    }
    return query.trim();
}
