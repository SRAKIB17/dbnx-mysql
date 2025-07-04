"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const index_js_1 = require("../utils/index.js");
const utils_js_1 = require("./utils.js");
function update(table, { joins = [], values, where = "", defaultValues = [], limit, sort, fromSubQuery, setCalculations, }) {
    if (!table) {
        throw new Error("⚠️ The `table` parameter is required.");
    }
    if (!where) {
        throw new Error("⚠️ The `where` parameter is required.");
    }
    if (!values && !defaultValues.length && !setCalculations && !fromSubQuery) {
        throw new Error("⚠️ No update data provided.");
    }
    let updateInfo = "";
    for (const column in values) {
        if (!values.hasOwnProperty(column))
            continue;
        const value = values[column];
        if (typeof value === "object" && value?.hasOwnProperty("case")) {
            const caseStatement = value?.case
                ?.map((caseCondition) => {
                const { when, then } = caseCondition;
                return `WHEN ${when} THEN ${(0, index_js_1.escape)(then)}`;
            })
                .join(" ");
            updateInfo += `${updateInfo ? ", " : ""}${column} = CASE ${caseStatement} ELSE ${(0, index_js_1.escape)(value?.default)} END`;
        }
        else {
            const updateValue = typeof value === "number" ? value : (0, index_js_1.escape)(value).trim();
            updateInfo += `${updateInfo ? ", " : ""}${column} = ${updateValue}`;
        }
    }
    const calculations = setCalculations || {};
    const subQueries = fromSubQuery || {};
    for (const column in calculations) {
        if (!calculations.hasOwnProperty(column))
            continue;
        const calculation = calculations[column];
        updateInfo += `${updateInfo ? ", " : ""}${column} = ${calculation}`;
    }
    for (const column in subQueries) {
        if (!subQueries.hasOwnProperty(column))
            continue;
        const calculation = subQueries[column];
        updateInfo += `${updateInfo ? ", " : ""}${column} = ${calculation}`;
    }
    if (defaultValues?.length) {
        for (const column of defaultValues) {
            updateInfo += `${updateInfo ? ", " : ""}${column} = DEFAULT`;
        }
    }
    const joinStatements = (0, utils_js_1.parseJoins)(joins);
    let query = `UPDATE ${table}${joinStatements} SET ${updateInfo}`;
    if (where) {
        query += ` WHERE ${where}`;
    }
    if (sort) {
        query += (0, utils_js_1.parseSort)(sort);
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    return `${query};`;
}
