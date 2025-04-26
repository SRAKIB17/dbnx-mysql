# `@dbnx/mysql` update Method API Reference

The `update` method in `@dbnx/mysql` enables updating records in a MySQL database table or model based on specified conditions. It supports flexible configuration, including direct value updates, `CASE` expressions, joins, sorting, limits, and calculated fields, making it suitable for both simple and complex update operations.

---

## 1. Overview

The `update` method modifies existing records in a specified table or model, offering extensive customization through the `UpdateParamsType` interface. It supports both table-based queries (for query building) and model-based queries (for immediate execution), with options for conditional updates, joins, sorting, and more.

---

## 2. Method Signature

```typescript
public update<tables extends string[]>(table: string, props: UpdateParamsType<tables>): MySQLHandler;
public update<tables extends string[]>(model: typeof Model, props: UpdateParamsType<tables>): Promise<ResponseType>;
public update(...args: any): MySQLHandler | Promise<ResponseType>;
```

---

## 3. Parameters

| Parameter | Type               | Description                                                             | Required                 |
| --------- | ------------------ | ----------------------------------------------------------------------- | ------------------------ |
| `table`   | `string`           | Name of the table to update (e.g., `'users'`).                          | Yes (if not using model) |
| `model`   | `typeof Model`     | Model class for ORM-based updates (e.g., `User`).                       | Yes (if not using table) |
| `props`   | `UpdateParamsType` | Configuration object specifying update values, conditions, and options. | Yes                      |

---

## 4. Response

- **Table Name**: Returns a `MySQLHandler` instance for query chaining (e.g., with `.build()` or `.execute()`).
- **Model**: Returns a `Promise<ResponseType>` containing the result of the update operation (e.g., number of affected rows).

---

## 5. UpdateParamsType

The `UpdateParamsType` interface defines the configuration for the update operation.

```typescript
export type UpdateParamsType<Tables extends string[]> = {
  values?: {
    [key: string]:
      | string
      | number
      | null
      | {
          case: { when: string; then: any }[];
          default: any;
        };
  };
  sort?:
    | { [P in Tables[number]]?: Record<string, 1 | -1> }
    | Record<string, 1 | -1>
    | string;
  where: string;
  defaultValues?: string[];
  limit?: string | number;
  joins?: JoinsType<Tables>;
  fromSubQuery?: Record<string, string>;
  setCalculations?: { [key: string]: string };
};
```

### Parameters

| Parameter         | Type                        | Description                                                           |
| ----------------- | --------------------------- | --------------------------------------------------------------------- |
| `values`          | `object`                    | Columns and values to update (direct values or `CASE` expressions).   |
| `sort`            | `object \| string`          | Sorting criteria (e.g., `{ name: 1 }` for ascending).                 |
| `where`           | `string`                    | Condition for selecting records (e.g., `'id = 5'`).                   |
| `defaultValues`   | `string[]`                  | Columns to set to their default values.                               |
| `limit`           | `string \| number`          | Maximum number of records to update.                                  |
| `joins`           | `JoinsType<Tables>`         | Join conditions for multi-table updates.                              |
| `fromSubQuery`    | `Record<string, string>`    | Subquery for updating records.                                        |
| `setCalculations` | `{ [key: string]: string }` | Calculated values (e.g., `{ total_price: 'quantity * unit_price' }`). |

---

## 6. Examples

### Updating Records Using a Table Name

Construct an update query with sorting, limit, and joins.

```typescript
const query = db
  .update("users", {
    values: { age: 30, name: "John" },
    where: "id = 5",
    sort: { name: "ASC" },
    limit: 10,
    joins: { type: "INNER", table: "orders", on: "users.id = orders.user_id" },
  })
  .build();
console.log(query);
// SQL: UPDATE users INNER JOIN orders ON users.id = orders.user_id SET age = 30, name = 'John' WHERE id = 5 ORDER BY name ASC LIMIT 10;
```

Execute the query:

```typescript
const result = await db
  .update("users", {
    values: { age: 30, name: "John" },
    where: "id = 5",
  })
  .execute();
console.log(result); // Logs execution result
```

### Updating Records Using a Model

Update records directly using a model.

```typescript
const result = await User.update({
  values: { age: 30, name: "John" },
  where: "id = 5",
  sort: { name: "ASC" },
  limit: 10,
});
console.log(result); // Logs result of update operation
```

### Using CASE Expressions

Perform conditional updates with `CASE`.

```typescript
const query = await db
  .update("users", {
    values: {
      age: {
        case: [
          { when: 'status = "active"', then: 35 },
          { when: 'status = "inactive"', then: 25 },
        ],
        default: 30,
      },
    },
    where: "id = 5",
  })
  .build();
console.log(query);
// SQL: UPDATE users SET age = CASE WHEN status = 'active' THEN 35 WHEN status = 'inactive' THEN 25 ELSE 30 END WHERE id = 5;
```

### Using Joins and Calculations

Update records with joins and calculated fields.

```typescript
const query = await db
  .update("orders", {
    values: { status: "shipped" },
    setCalculations: { total_price: "quantity * unit_price" },
    where: "order_id = 100",
    joins: {
      type: "INNER",
      table: "products",
      on: "orders.product_id = products.id",
    },
  })
  .build();
console.log(query);
// SQL: UPDATE orders INNER JOIN products ON orders.product_id = products.id SET status = 'shipped', total_price = quantity * unit_price WHERE order_id = 100;
```

---

## 7. Errors

| Error Message                                                    | Cause                                           | Solution                                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------- |
| `No arguments provided to 'update'.`                             | Missing table name or model.                    | Provide a valid table name or model as the first argument.                |
| `Invalid first argument: must be a table name or a Model class.` | First argument is neither a string nor a model. | Ensure the first argument is a valid table name or model class.           |
| `Props must be a non-empty object.`                              | Invalid or empty `props` object.                | Provide a valid `UpdateParamsType` object with at least a `where` clause. |

---

## 8. Internal Methods

- **`update`**: Constructs the SQL `UPDATE` query based on the provided parameters.
- **`parseJoins`**: Formats the `joins` parameter into SQL `JOIN` clauses.
- **`parseSort`**: Formats the `sort` parameter into SQL `ORDER BY` clauses.

---

## 9. Use Cases

- **Simple Updates**: Update specific fields for records matching a condition (e.g., updating user details).
- **Conditional Updates**: Use `CASE` expressions for dynamic updates based on conditions (e.g., setting different values for active vs. inactive users).
- **Multi-Table Updates**: Use `joins` to update records across related tables (e.g., updating order status based on product data).
- **Calculated Updates**: Use `setCalculations` for dynamic field updates (e.g., recalculating totals based on other columns).

---
