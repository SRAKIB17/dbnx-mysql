//! **********************************  FOR CREATE *********************************

export type CreateParamsType<columns extends any[]> = {
    [P in columns[number]]?: string | "CURRENT_TIMESTAMP" | undefined
} | Record<string, string | number | 'CURRENT_TIMESTAMP' | undefined> |
    {
        [P in columns[number]]?: string | "CURRENT_TIMESTAMP"
    }[]

export type CreateOptionsType = {
    uniqueColumn?: string | null,
    onDuplicateUpdateFields?: string[]
}

//! **********************************  FOR DELETE *********************************

export interface DeleteParamsType<Tables extends string[]> {
    where: string;
    sort?: SortType<Tables>;
    limit?: string | number;
    joins?: JoinsType<Tables>;
}


//! **********************************  FOR FIND *********************************


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

//! **********************************  FOR UPDATE *********************************
export type UpdateParamsType<Tables extends string[]> = {
    values?: {
        [key: string]: string | number | null | undefined | {
            case: {
                when: string;  // The condition in the WHEN clause
                then: any;     // The value to set in the THEN clause
            }[];   // The CASE structure with an array of WHEN/THEN conditions
            default: any;       // The default value for the column when no conditions match
        };
    },
    sort?: { [P in Tables[number]]?: Record<string, 1 | -1> } | Record<string, 1 | -1> | string,
    where: string,
    defaultValues?: string[],
    limit?: string | number,
    joins?: JoinsType<Tables>,
    fromSubQuery?: Record<string, string>,
    setCalculations?: {    // For SET calculation
        [key: string]: string;
    }
}

//! **********************************  FOR JOINS *********************************

export type JoinsType<Tables extends string[]> = Array<{
    operator?: OperatorType | string,
    type?: 'JOIN' | 'INNER JOIN' | 'OUTER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN';
} | {
    on?: string, table?: string
} | {
    [key: string]: string
} | {
    [P in Tables[number]]?: string
}>

export type SortType<Tables extends string[]> = { [P in Tables[number]]?: Record<string, 1 | -1> } | Record<string, 1 | -1> | string

export type OperatorType =
    | '='    // Equality
    | '!='   // Not equal (ANSI SQL standard)
    | '<>'   // Not equal (alternate syntax)
    | '<'    // Less than
    | '>'    // Greater than
    | '<='   // Less than or equal
    | '>='   // Greater than or equal
    | 'LIKE' // Pattern matching
    | 'IN'   // Check if value exists in a set
    | 'BETWEEN'; // Range condition
