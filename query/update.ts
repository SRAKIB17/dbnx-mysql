import { UpdateParamsType } from "../types";
import { parseJoins, parseSort } from "./utils";

export function update<Tables extends string[]>(table: string, {
    joins = [],
    values,
    where = '',
    defaultValues = [],
    limit,
    sort,
    fromSubQuery,
    setCalculations
}: UpdateParamsType<Tables>) {

    if (!table) {
        throw new Error("⚠️ The `table` parameter is required.");
    }
    if (!where) {
        throw new Error("⚠️ The `where` parameter is required.");
    }

    if (!values && !defaultValues.length && !setCalculations && !fromSubQuery) {
        throw new Error("⚠️ No update data provided.");
    }

    // Handling the update data and CASE statements
    let updateInfo = '';
    for (const column in values) {
        if (!values.hasOwnProperty(column)) continue;

        const value = values[column];
        if (typeof value === 'object' && value?.hasOwnProperty('case')) {
            const caseStatement = value?.case?.map((caseCondition) => {
                const { when, then } = caseCondition;
                return `WHEN ${when} THEN ${JSON.stringify(then)}`;
            }).join(' ');

            updateInfo += `${updateInfo ? ', ' : ''}${column} = CASE ${caseStatement} ELSE ${JSON.stringify(value?.default)} END`;
        } else {
            const isString = typeof value === 'string';
            const isNull = value == null;

            const updateValue = isString ?
                JSON.stringify(value?.trim()) :
                isNull ? "NULL" : value;

            updateInfo += `${updateInfo ? ', ' : ''}${column} = ${updateValue}`;
        }
    }

    const calculations = setCalculations || {};
    const subQueries = fromSubQuery || {};

    // Handling SET calculations (e.g., column = column + 10)
    for (const column in calculations) {
        if (!calculations.hasOwnProperty(column)) continue;

        const calculation = calculations[column];
        updateInfo += `${updateInfo ? ', ' : ''}${column} = ${calculation}`;
    }

    // Handling SET with subQuery

    for (const column in subQueries) {
        if (!subQueries.hasOwnProperty(column)) continue;

        const calculation = subQueries[column];
        updateInfo += `${updateInfo ? ', ' : ''}${column} = ${calculation}`;
    }



    // Handling default value assignments
    if (defaultValues?.length) {
        for (const column of defaultValues) {
            updateInfo += `${updateInfo ? ', ' : ''}${column} = DEFAULT`;
        }
    }



    // Building the JOIN statements if present
    const joinStatements = parseJoins(joins);

    // Constructing the query
    let query = `UPDATE${joinStatements} ${table} SET ${updateInfo}`;

    // Adding WHERE condition if present
    if (where) {
        query += ` WHERE ${where}`;
    }

    // Add sorting if provided
    if (sort) {
        query += parseSort(sort);
    }

    // Adding LIMIT
    if (limit) {
        query += ` LIMIT ${limit}`;
    }

    return `${query};`;
}
