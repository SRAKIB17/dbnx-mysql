import { JoinsType, SortType } from "./types";
import { parseColumns, parseGroupBy, parseJoins, parseSort } from "./utils";

export type CommonStringObjectArray<Tables extends string[], value> =
    { [P in Tables[number]]?: value } | string | string[];


let aggregates_alias = {
    'MIN': 'minimum',
    'MAX': 'maximum',
    'SUM': 'summation',
    'COUNT': 'count',
    'AVG': 'average'
}

export interface FindOneParamsType<Tables extends string[]> {
    distinct?: boolean;
    sort?: SortType<Tables>;

    columns?: {
        [P in Tables[number]]?: string[]
    } | {
        extra?: string | string[]
    } | string | string[];
    groupBy?: {
        [P in Tables[number]]?: string[]
    } | {
        extra?: string | string[]
    } | string | string[];

    aggregates?: Array<{
        [K in keyof Record<'MIN' | 'MAX' | 'SUM' | 'COUNT' | 'AVG', string>]?: string;
    } | { alias?: string; }>
    where?: string,
    having?: string,
    subQueries?: {
        query: string,
        as?: string,
    }[],
    joins?: JoinsType<Tables>,
    recursiveCTE?: { baseCase: string, recursiveCase: string, alias: string },
}

export interface FindAllParamsType<Tables extends string[]> {
    distinct?: boolean;
    sort?: SortType<Tables>;

    limitSkip?: { limit?: number; skip?: number };
    columns?: {
        [P in Tables[number]]?: string[]
    } | {
        extra?: string | string[]
    } | string | string[];
    groupBy?: {
        [P in Tables[number]]?: string[]
    } | {
        extra?: string | string[]
    } | string | string[];

    aggregates?: Array<{
        [K in keyof Record<'MIN' | 'MAX' | 'SUM' | 'COUNT' | 'AVG', string>]?: string;
    } | { alias?: string; }>
    where?: string,
    having?: string,
    subQueries?: {
        query: string,
        as?: string,
    }[],
    joins?: JoinsType<Tables>,
    recursiveCTE?: { baseCase: string, recursiveCase: string, alias: string },
}

export function findingQuery<Tables extends string[]>(table: string, config: FindAllParamsType<Tables> = {}): string {
    const {
        distinct,
        sort,
        limitSkip,
        columns,
        subQueries,
        groupBy,
        recursiveCTE,
        aggregates,
        where,
        having,
        joins,
    } = config;
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


    let select = ''

    //! SELECT Columns
    if (columns) {
        select = parseColumns(columns);
    }
    if (subQueries) {
        const subQueryStatement = subQueries
            .map(subQuery => {
                // Build the subquery string with optional alias
                return `(${subQuery.query})${subQuery.as ? ` AS ${subQuery.as}` : ""}`;
            })
            .join(", ");
        select += `${select ? ", " : ""} ${subQueryStatement}`
    }

    if (aggregates) {
        const aggStrings = aggregates.map((agg: any) => {
            const { alias, ...functions } = agg; // Destructure the alias and the function
            let functionStr = '';

            for (const func in functions) {
                if (!functions.hasOwnProperty(func)) continue;

                const column = functions[func];
                const aliasName = alias
                    ? alias
                    : (aggregates_alias as any)[func] || func;

                functionStr += `${functionStr ? ', ' : ''}${func}(${column}) AS ${aliasName}`;
            }

            return functionStr;

        });
        select += `${select ? ", " : ""}${aggStrings.join(", ")}`;
    }

    //! FROM Clause
    query += `${select ? select : "*"} FROM ${main_table}`;

    //! Joins
    if (joins) {
        query += parseJoins(joins)
    }

    //! WHERE Clause
    if (where) {
        query += ` WHERE ${where}`;
    }

    //! GROUP BY Clause
    if (groupBy) {
        query += parseGroupBy(groupBy) || ""
    }

    //! HAVING Clause
    if (having) {
        query += ` HAVING ${having}`;
    }

    //! ORDER BY Clause
    if (sort) {
        query += parseSort(sort);
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

    return `${query.trim()};`;
}