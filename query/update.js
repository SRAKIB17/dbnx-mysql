"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const utils_1 = require("./utils");
function update(table, { joins = [], updateData = {}, where = '', nullValues = [], defaultValues = [], limit, sort, fromSubQuery = {}, setCalculations = {} }) {
    if (!table) {
        throw new Error("⚠️ The `table` parameter is required.");
    }
    if (!where) {
        throw new Error("⚠️ The `where` parameter is required.");
    }
    // Handling the update data and CASE statements
    let updateInfo = Object.entries(updateData)?.map(([column, value]) => {
        // If the value is an object, use a CASE expression for dynamic updates
        if (typeof value === 'object' && value?.hasOwnProperty('case')) {
            const caseStatement = value.case.map((caseCondition) => {
                const { when, then } = caseCondition;
                return `WHEN ${when} THEN ${JSON.stringify(then)}`;
            }).join(' ');
            return `${column} = CASE ${caseStatement} ELSE ${JSON.stringify(value?.default)} END`;
        }
        // Regular update without CASE
        const isString = typeof value === 'string';
        const column_value = value;
        const update_value = isString ? JSON.stringify(column_value?.trim()) : column_value;
        return `${column} = ${update_value}`;
    }).join(',');
    // Handling SET calculations (e.g., column = column + 10)
    if (Object.keys(setCalculations).length) {
        const calcUpdates = Object.entries(setCalculations).map(([column, calculation]) => {
            return `${column} = ${calculation}`;
        }).join(', ');
        updateInfo += updateInfo ? `, ${calcUpdates}` : calcUpdates;
    }
    // Handling SET with subQuery
    if (Object.keys(fromSubQuery).length) {
        const fromSubQueryUpdates = Object.entries(fromSubQuery).map(([column, calculation]) => {
            return `${column} = ${calculation}`;
        }).join(', ');
        updateInfo += updateInfo ? `, ${fromSubQueryUpdates}` : fromSubQueryUpdates;
    }
    // Handling NULL value assignments
    if (nullValues?.length) {
        const nullAssignments = nullValues.map(column => `${column} = NULL`).join(', ');
        updateInfo += updateInfo ? `, ${nullAssignments}` : nullAssignments;
    }
    // Handling default value assignments
    if (defaultValues?.length) {
        const defaultAssignments = defaultValues.map(column => `${column} = DEFAULT`).join(', ');
        updateInfo += updateInfo ? `, ${defaultAssignments}` : defaultAssignments;
    }
    // Building the JOIN statements if present
    const joinStatements = (0, utils_1.parseJoins)(joins);
    // Constructing the query
    let query = `UPDATE${joinStatements} ${table} SET ${updateInfo}`;
    // Adding WHERE condition if present
    if (where) {
        query += ` WHERE ${where}`;
    }
    // Add sorting if provided
    if (sort) {
        query += (0, utils_1.parseSort)(sort);
    }
    // Adding LIMIT
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    return query;
}
