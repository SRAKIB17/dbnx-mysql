
---

This API offers methods to query and retrieve records from the database. You can find a single record or multiple records with advanced filtering, sorting, and aggregation capabilities.

---

### **1. `findAll` Method**

#### **Method Signature**

```typescript
public findAll<tables extends string[]>(table: string, config?: FindAllParamsType<tables>): MySQLHandler;
public findAll<tables extends string[]>(model: typeof Model, config?: FindAllParamsType<tables>): Promise<ResponseType>;
```

#### **Parameters:**

- **`table`** (`string`):
  - The name of the table to query.
  - Alternatively, you can pass a `Model` class.
  
- **`config`** (`FindAllParamsType<tables>`):
  - Optional configuration for querying the table.
  - **Possible options:**
    - `distinct`: If true, returns distinct rows.
    - `sort`: Sorting configuration, defined using `SortType`.
    - `limitSkip`: Pagination options (`limit` and `skip` values).
    - `columns`: Columns to select (can be specified per table).
    - `groupBy`: Columns to group by.
    - `aggregates`: Array of aggregate functions (e.g., `MIN`, `MAX`).
    - `where`: `WHERE` clause condition.
    - `having`: `HAVING` clause condition.
    - `subQueries`: List of subqueries.
    - `joins`: Table joins, defined using `JoinsType`.
    - `recursiveCTE`: Recursive common table expressions.

#### **Returns:**

- **`MySQLHandler`**: If a `table` name is provided, the query handler is returned to build and execute the query.
- **`Promise<ResponseType>`**: If a `Model` class is provided, the query is executed, and a `Promise` with the response is returned.

#### **Example:**

```typescript
const results = await findAll('users', {
  sort: { name: 1 },
  limitSkip: { limit: 10, skip: 0 },
  columns: ['name', 'email'],
  where: 'status = "active"',
});
```

---

### **2. `findOne` Method**

#### **Method Signature**

```typescript
public findOne<tables extends string[]>(table: string, config?: FindOneParamsType<tables>): MySQLHandler;
public findOne<tables extends string[]>(model: typeof Model, config?: FindOneParamsType<tables>): Promise<ResponseType>;
```

#### **Parameters:**

- **`table`** (`string`):
  - The name of the table to query.
  - Alternatively, you can pass a `Model` class.
  
- **`config`** (`FindOneParamsType<tables>`):
  - Optional configuration for querying the table.
  - **Possible options:**
    - `distinct`: If true, returns distinct rows.
    - `sort`: Sorting configuration, defined using `SortType`.
    - `columns`: Columns to select (can be specified per table).
    - `groupBy`: Columns to group by.
    - `aggregates`: Array of aggregate functions.
    - `where`: `WHERE` clause condition.
    - `having`: `HAVING` clause condition.
    - `subQueries`: List of subqueries.
    - `joins`: Table joins, defined using `JoinsType`.
    - `recursiveCTE`: Recursive common table expressions.

#### **Returns:**

- **`MySQLHandler`**: If a `table` name is provided, the query handler is returned to build and execute the query.
- **`Promise<ResponseType>`**: If a `Model` class is provided, the query is executed, and a `Promise` with the response is returned.

#### **Example:**

```typescript
const user = await findOne('users', {
  where: 'id = 1',
  columns: ['id', 'name', 'email'],
});
```

---

### **3. `JoinsType`**

Defines the different types of joins that can be used in the query.

```typescript
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
```

#### **Usage:**

You can define how to join tables, specify the join type (e.g., `LEFT JOIN`), and use operators (e.g., `=` or `IN`).

#### **Example:**

```typescript
const results = await findAll('users', {
  joins: [
    { type: 'INNER JOIN', table: 'profiles', on: 'users.id = profiles.user_id' },
  ],
});
```

---

### **4. `SortType`**

Defines how the results should be sorted.

```typescript
export type SortType<Tables extends string[]> = { [P in Tables[number]]?: Record<string, 1 | -1> } | Record<string, 1 | -1> | string;
```

#### **Usage:**

You can sort the results based on one or more columns.

- `1` indicates ascending order.
- `-1` indicates descending order.

#### **Example:**

```typescript
const sortedResults = await findAll('products', {
  sort: { price: -1 }, // Sort by price in descending order
});
```

---

### **5. `OperatorType`**

Defines the different operators that can be used in the query conditions.

```typescript
export type OperatorType =
    | '='    // Equality
    | '!='   // Not equal
    | '<>'   // Not equal (alternate syntax)
    | '<'    // Less than
    | '>'    // Greater than
    | '<='   // Less than or equal
    | '>='   // Greater than or equal
    | 'LIKE' // Pattern matching
    | 'IN'   // Check if value exists in a set
    | 'BETWEEN'; // Range condition
```

#### **Usage:**

You can use these operators in the `where` condition to define filters on the data.

#### **Example:**

```typescript
const results = await findAll('orders', {
  where: 'totalAmount > 100 AND status = "completed"',
  operator: 'IN',
});
```

---

### **6. `FindOneParamsType` Interface**

The configuration object for a single query to find one record.

```typescript
export interface FindOneParamsType<Tables extends string[]> {
    distinct?: boolean;
    sort?: SortType<Tables>;
    columns?: { [P in Tables[number]]?: string[] } | string | string[];
    groupBy?: { [P in Tables[number]]?: string[] } | string | string[];
    aggregates?: Array<{ [K in keyof Record<'MIN' | 'MAX' | 'SUM' | 'COUNT' | 'AVG', string>]?: string }>;
    where?: string;
    having?: string;
    subQueries?: { query: string, as?: string }[];
    joins?: JoinsType<Tables>;
    recursiveCTE?: { baseCase: string, recursiveCase: string, alias: string };
}
```

#### **Usage:**

This is used to pass query options for the `findOne` operation. You can filter data, sort, group, and more.

---

### **7. `FindAllParamsType` Interface**

The configuration object for a query to find multiple records.

```typescript
export interface FindAllParamsType<Tables extends string[]> {
    distinct?: boolean;
    sort?: SortType<Tables>;
    limitSkip?: { limit?: number; skip?: number };
    columns?: { [P in Tables[number]]?: string[] } | string | string[];
    groupBy?: { [P in Tables[number]]?: string[] } | string | string[];
    aggregates?: Array<{ [K in keyof Record<'MIN' | 'MAX' | 'SUM' | 'COUNT' | 'AVG', string>]?: string }>;
    where?: string;
    having?: string;
    subQueries?: { query: string, as?: string }[];
    joins?: JoinsType<Tables>;
    recursiveCTE?: { baseCase: string, recursiveCase: string, alias: string };
}
```

#### **Usage:**

This is used to pass query options for the `findAll` operation. You can control the results using filtering, sorting, pagination, and more.

---

### **Conclusion**

With the `find` API, you can easily query the database to fetch single or multiple records, with flexible configurations for sorting, filtering, grouping, and joining tables. This API is highly customizable to suit various database query requirements, giving you full control over how the data is retrieved.

---
