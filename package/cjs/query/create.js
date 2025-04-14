"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = insert;
const utils_1 = require("../utils");
function insert(table, values, { onDuplicateUpdateFields = [], uniqueColumn }) {
    if (!values) {
        throw new Error("❌ Insert data array is empty");
    }
    let col = "";
    let val = "";
    const sanitizedValues = (values) => Object.values(values)
        .map((value) => {
        if (value === "CURRENT_TIMESTAMP") {
            return value;
        }
        if (value == null || value == undefined) {
            return "NULL";
        }
        if (typeof value === "string") {
            return (0, utils_1.escape)(value);
        }
        return value;
    })
        ?.join(", ");
    if (Array.isArray(values)) {
        col = `(${Object.keys(values[0]).join(", ")})`;
        val = values.map((row) => `(${sanitizedValues(row)})`).join(", ");
    }
    else {
        col = `(${Object.keys(values).join(", ")})`;
        val = `(${sanitizedValues(values)})`;
    }
    let sql = "";
    if (uniqueColumn) {
        sql = `INSERT IGNORE INTO ${table} ${col} VALUES ${val};`;
    }
    else if (onDuplicateUpdateFields.length > 0) {
        const updateFields = onDuplicateUpdateFields
            .map((field) => `${field} = VALUES(${field})`)
            .join(", ");
        sql = `INSERT INTO ${table} ${col} VALUES ${val} ON DUPLICATE KEY UPDATE ${updateFields};`;
    }
    else {
        sql = `INSERT INTO ${table} ${col} VALUES ${val};`;
    }
    return sql;
}
