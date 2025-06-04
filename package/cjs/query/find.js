"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = find;
const utils_js_1 = require("./utils.js");
let aggregates_alias = {
    MIN: "minimum",
    MAX: "maximum",
    SUM: "summation",
    COUNT: "count",
    AVG: "average",
};
function find(table, config = {}) {
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
        select = (0, utils_js_1.parseColumns)(columns);
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
        query += (0, utils_js_1.parseJoins)(joins);
    }
    if (where) {
        query += ` WHERE ${where}`;
    }
    if (groupBy) {
        query += (0, utils_js_1.parseGroupBy)(groupBy) || "";
    }
    if (having) {
        query += ` HAVING ${having}`;
    }
    if (sort) {
        query += (0, utils_js_1.parseSort)(sort);
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
