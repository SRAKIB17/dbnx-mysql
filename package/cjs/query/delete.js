"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = destroy;
const utils_1 = require("./utils");
function destroy(table, { where, joins, limit, sort }) {
    if (!table) {
        throw new Error("⚠️ The `table` parameter is required.");
    }
    if (!where) {
        throw new Error("⚠️ The `where` parameter is required.");
    }
    let query = `DELETE ${table} FROM ${table}`;
    query += joins ? (0, utils_1.parseJoins)(joins) : "";
    if (where) {
        query += ` WHERE ${where}`;
    }
    if (sort) {
        query += (0, utils_1.parseSort)(sort);
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    return `${query};`;
}
