
# `@dbnx/mysql` delete Method API Reference

The `delete` method in `@dbnx/mysql` enables the deletion of records from a MySQL database table or model based on specified conditions. It supports both table-based and model-based queries, with options for filtering, sorting, limiting, and joining tables.

---

## 1. Overview

The `delete` method removes records from a specified table or model, offering flexible configuration through the `DeleteParamsType` interface. It can be used with a raw table name for query building or with a model for immediate execution, supporting conditions, joins, sorting, and limits.

---

## 2. Method Signature

```typescript
public delete<tables extends string[]>(table: string, props: DeleteParamsType<tables>): MySQLHandler;
public delete<tables extends string[]>(model: typeof Model, props: DeleteParamsType<tables>): Promise<ResponseType>;
public delete(...args: any): MySQLHandler | Promise<ResponseType>;
```

---

## 3. Parameters

| Parameter | Type                     | Description                                                                 | Required |
|-----------|--------------------------|-----------------------------------------------------------------------------|----------|
| `table`   | `string`                 | Name of the table to delete from (e.g., `'users'`).                         | Yes (if not using model) |
| `model`   | `typeof Model`           | Model class for ORM-based deletion (e.g., `User`).                          | Yes (if not using table) |
| `props`   | `DeleteParamsType`       | Configuration object specifying deletion conditions and options.            | Yes      |

---

## 4. Response

- **Table Name**: Returns a `MySQLHandler` instance for query chaining (e.g., with `.build()` or `.execute()`).
- **Model**: Returns a `Promise<ResponseType>` containing the result of the delete operation (e.g., number of affected rows).

---

## 5. DeleteParamsType

The `DeleteParamsType` interface defines the configuration for the delete operation.

```typescript
export interface DeleteParamsType<Tables extends string[]> {
  where: string;                    // Condition for selecting rows to delete
  sort?: SortType<Tables>;          // Optional sorting criteria
  limit?: string | number;          // Optional limit on number of deleted rows
  joins?: JoinsType<Tables>;        // Optional JOIN clauses for multi-table deletion
}
```

### Parameters

| Parameter | Type                     | Description                                                                 |
|-----------|--------------------------|-----------------------------------------------------------------------------|
| `where`   | `string`                 | Condition for selecting records (e.g., `'age > 30'`).                       |
| `sort`    | `SortType<Tables>`       | Sorting criteria (e.g., `{ name: 'ASC' }`).                                 |
| `limit`   | `string \| number`        | Maximum number of records to delete (e.g., `10`).                           |
| `joins`   | `JoinsType<Tables>`      | Join conditions for multi-table deletions (e.g., `{ table: 'orders', on: 'users.id = orders.user_id' }`). |

---

## 6. Examples

### Deleting Records Using a Table Name

Construct a delete query with sorting, limit, and joins.

```typescript
const query = db.delete('users', {
  where: 'age > 30',
  sort: { name: 'ASC' },
  limit: 10,
  joins: { type: 'INNER', table: 'orders', on: 'users.id = orders.user_id' },
}).build();
console.log(query);
// SQL: DELETE FROM users INNER JOIN orders ON users.id = orders.user_id WHERE age > 30 ORDER BY name ASC LIMIT 10;
```

Execute the query:

```typescript
const result = await db.delete('users', {
  where: 'age > 30',
  sort: { name: 'ASC' },
  limit: 10,
}).execute();
console.log(result); // Logs execution result
```

### Deleting Records Using a Model

Delete records directly using a model.

```typescript
const result = await User.delete({
  where: 'age > 30',
  sort: { name: 'ASC' },
  limit: 10,
});
console.log(result); // Logs result of delete operation
```

---

## 7. Errors

| Error Message                                      | Cause                                              | Solution                                                                 |
|----------------------------------------------------|----------------------------------------------------|--------------------------------------------------------------------------|
| `No arguments provided to 'delete'.`               | Missing table name or model.                       | Provide a valid table name or model as the first argument.               |
| `Invalid first argument: must be a table name or a Model class.` | First argument is neither a string nor a model.    | Ensure the first argument is a valid table name or model class.          |
| `Props must be a non-empty object.`                | Invalid or empty `props` object.                   | Provide a valid `DeleteParamsType` object with at least a `where` clause.|

---

## 8. Internal Methods

- **`destroy`**: Constructs the `DELETE` SQL query based on the provided parameters.
- **`parseJoins`**: Formats the `joins` parameter into SQL `JOIN` clauses.
- **`parseSort`**: Formats the `sort` parameter into SQL `ORDER BY` clauses.

---

## 9. Use Cases

- **Selective Deletion**: Delete specific records based on conditions (e.g., inactive users or outdated orders).
- **Multi-Table Deletion**: Use `joins` to delete records from related tables while maintaining referential integrity.
- **Controlled Deletion**: Apply `sort` and `limit` to delete records in a specific order or restrict the number of deletions.

---
