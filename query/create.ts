import { CreateOptionsType, CreateParamsType } from "../types";


export function insertInto<columns extends string[]>(
    table: string,
    values: CreateParamsType<columns>,
    { onDuplicateUpdateFields = [], uniqueColumn }: CreateOptionsType,
) {

    if (!values) {
        throw new Error('❌ Insert data array is empty');
    }

    let col = '';
    let val = '';

    const sanitizedValues = (values: any) => Object.values(values).map(value => {
        if (value === 'CURRENT_TIMESTAMP') {
            return value;
        }
        if (value == null) {
            return 'NULL'
        }

        if (typeof value === 'string') {
            // Escape single quotes and other dangerous characters
            return `'${value.replace(/'/g, "''")}'`; // Escape single quotes within strings
        }

        // For numbers, booleans, or other types, just return the value
        return value;
    })?.join(", ");


    if (Array.isArray(values)) {
        col = `(${Object.keys(values[0]).join(', ')})`;
        val = values.map(row => `(${sanitizedValues(row)})`).join(', ');
    }
    else {
        col = `(${Object.keys(values).join(', ')})`;
        val = `(${sanitizedValues(values)})`;
    }

    let sql = '';

    if (uniqueColumn) {
        // Generate `INSERT IGNORE` query to prevent duplicates
        sql = `INSERT IGNORE INTO ${table} ${col} VALUES ${val};`;
    } else if (onDuplicateUpdateFields.length > 0) {
        // Generate `ON DUPLICATE KEY UPDATE` query
        const updateFields = onDuplicateUpdateFields.map(field => `${field} = VALUES(${field})`).join(', ');
        sql = `INSERT INTO ${table} ${col} VALUES ${val} ON DUPLICATE KEY UPDATE ${updateFields};`;
    } else {
        // Generate a standard `INSERT` query
        sql = `INSERT INTO ${table} ${col} VALUES ${val};`;
    }
    return sql;
}