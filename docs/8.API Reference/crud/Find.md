
# `@dbnx/mysql` API Reference: findAll, findOne, and Related Types

This API reference details the `findAll` and `findOne` methods, along with their supporting types (`JoinsType`, `SortType`, `OperatorType`, `FindOneParamsType`, and `FindAllParamsType`). These methods enable flexible querying of MySQL databases, supporting filtering, sorting, pagination, joins, subqueries, aggregates, and recursive CTEs.

---

## 1. findAll Method

### Method Signature

```typescript
public findAll<tables extends string[]>(table: string, config?: FindAllParamsType<tables>): MySQLHandler;
public findAll<tables extends string[]>(model: typeof Model, config?: FindAllParamsType<tables>): Promise<ResponseType>;
```

### Parameters

| Parameter | Type                     | Description                                                                 | Required |
|-----------|--------------------------|-----------------------------------------------------------------------------|----------|
| `table`   | `string`                 | Name of the table to query (e.g., `'users'`).                               | Yes (if not using model) |
| `model`   | `typeof Model`           | Model class for ORM-based queries (e.g., `User`).                           | Yes (if not using table) |
| `config`  | `FindAllParamsType`      | Configuration object for customizing the query (e.g., filters, sorting).    | No       |

### Returns

- **Table Name**: Returns a `MySQLHandler` instance for query chaining (e.g., with `.build()` or `.execute()`).
- **Model**: Returns a `Promise<ResponseType>` containing the query results.

### Example

```typescript
const results = await db.findAll('users', {
  sort: { name: 1 },
  limitSkip: { limit: 10, skip: 0 },
  columns: ['name', 'email'],
  where: 'status = "active"',
}).execute();
console.log(results); // Logs fetched records
// SQL: SELECT name, email FROM users WHERE status = 'active' ORDER BY name ASC LIMIT 10 OFFSET 0;
```

**Using a Model**:

```typescript
const results = await User.findAll({
  sort: { name: 1 },
  limitSkip: { limit: 10, skip: 0 },
  columns: ['name', 'email'],
  where: 'status = "active"',
});
console.log(results); // Logs fetched records
```

---

## 2. findOne Method

### Method Signature

```typescript
public findOne<tables extends string[]>(table: string, config?: FindOneParamsType<tables>): MySQLHandler;
public findOne<tables extends string[]>(model: typeof Model, config?: FindOneParamsType<tables>): Promise<ResponseType>;
```

### Parameters

| Parameter | Type                     | Description                                                                 | Required |
|-----------|--------------------------|-----------------------------------------------------------------------------|----------|
| `table`   | `string`                 | Name of the table to query (e.g., `'users'`).                               | Yes (if not using model) |
| `model`   | `typeof Model`           | Model class for ORM-based queries (e.g., `User`).                           | Yes (if not using table) |
| `config`  | `FindOneParamsType`      | Configuration object for customizing the query (e.g., filters, columns).    | No       |

### Returns

- **Table Name**: Returns a `MySQLHandler` instance for query chaining.
- **Model**: Returns a `Promise<ResponseType>` containing the single record.

### Example

```typescript
const user = await db.findOne('users', {
  where: 'id = 1',
  columns: ['id', 'name', 'email'],
}).execute();
console.log(user); // Logs single record
// SQL: SELECT id, name, email FROM users WHERE id = 1 LIMIT 1;
```

**Using a Model**:

```typescript
const user = await User.findOne({
  where: 'id = 1',
  columns: ['id', 'name', 'email'],
});
console.log(user); // Logs single record
```

---

## 3. JoinsType

### Definition

```typescript
export type JoinsType<Tables extends string[]> = Array<{
  operator?: OperatorType | string;
  type?: 'JOIN' | 'INNER JOIN' | 'OUTER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN';
} | {
  on?: string;
  table?: string;
} | {
  [key: string]: string;
} | {
  [P in Tables[number]]?: string;
}>;
```

### Usage

Specifies join conditions for multi-table queries, including join type and operator.

```typescript
const results = await db.findAll('users', {
  joins: [
    { type: 'INNER JOIN', table: 'profiles', on: 'users.id = profiles.user_id' },
  ],
  where: 'users.status = "active"',
}).execute();
// SQL: SELECT * FROM users INNER JOIN profiles ON users.id = profiles.user_id WHERE users.status = 'active';
```

---

## 4. SortType

### Definition

```typescript
export type SortType<Tables extends string[]> = 
  | { [P in Tables[number]]?: Record<string, 1 | -1> }
  | Record<string, 1 | -1>
  | string;
```

### Usage

Defines sorting criteria for query results. Use `1` for ascending and `-1` for descending.

```typescript
const sortedResults = await db.findAll('products', {
  sort: { price: -1 },
}).execute();
// SQL: SELECT * FROM products ORDER BY price DESC;
```

---

## 5. OperatorType

### Definition

```typescript
export type OperatorType =
  | '='
  | '!='
  | '<>'
  | '<'
  | '>'
  | '<='
  | '>='
  | 'LIKE'
  | 'IN'
  | 'BETWEEN';
```

### Usage

Used in `where` clauses to define conditions.

```typescript
const results = await db.findAll('orders', {
  where: 'totalAmount > 100 AND status = "completed"',
}).execute();
// SQL: SELECT * FROM orders WHERE totalAmount > 100 AND status = 'completed';
```

---

## 6. FindOneParamsType

### Definition

```typescript
export interface FindOneParamsType<Tables extends string[]> {
  distinct?: boolean;
  sort?: SortType<Tables>;
  columns?: { [P in Tables[number]]?: string[] } | string | string[];
  groupBy?: { [P in Tables[number]]?: string[] } | string | string[];
  aggregates?: Array<{ [K in keyof Record<'MIN' | 'MAX' | 'SUM' | 'COUNT' | 'AVG', string>]?: string }>;
  where?: string;
  having?: string;
  subQueries?: { query: string; as?: string }[];
  joins?: JoinsType<Tables>;
  recursiveCTE?: { baseCase: string; recursiveCase: string; alias: string };
}
```

### Usage

Configures the `findOne` query with filters, sorting, and other options.

```typescript
const user = await db.findOne('users', {
  where: 'id = 1',
  columns: ['id', 'name'],
  joins: [{ type: 'LEFT JOIN', table: 'profiles', on: 'users.id = profiles.user_id' }],
}).execute();
// SQL: SELECT users.id, users.name FROM users LEFT JOIN profiles ON users.id = profiles.user_id WHERE id = 1 LIMIT 1;
```

---

## 7. FindAllParamsType

### Definition

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
  subQueries?: { query: string; as?: string }[];
  joins?: JoinsType<Tables>;
  recursiveCTE?: { baseCase: string; recursiveCase: string; alias: string };
}
```

### Usage

Configures the `findAll` query with pagination, filtering, and other options.

```typescript
const results = await db.findAll('users', {
  limitSkip: { limit: 5, skip: 10 },
  where: 'status = "active"',
  columns: ['id', 'name'],
  sort: { name: 1 },
  aggregates: [{ COUNT: 'id', alias: 'user_count' }],
  groupBy: ['status'],
  having: 'COUNT(id) > 2',
}).execute();
// SQL: SELECT users.id, users.name, COUNT(id) AS user_count FROM users WHERE status = 'active' GROUP BY status HAVING COUNT(id) > 2 ORDER BY name ASC LIMIT 5 OFFSET 10;
```

---
