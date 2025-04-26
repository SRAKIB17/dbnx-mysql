# `@dbnx/mysql` executeMultiple() Method

The `executeMultiple()` method in `@dbnx/mysql` enables the execution of multiple database queries in sequence within a single transaction. This method supports chaining operations like `update`, `findAll`, `create`, `findOne`, and `delete`, providing a streamlined way to perform complex database operations.

---

## 1. Overview

The `executeMultiple()` method allows developers to chain multiple database operations (e.g., updates, inserts, queries, and deletions) and execute them sequentially in a single call. This approach ensures efficient query execution and simplifies transaction management, with built-in error handling and connection cleanup.

---

## 2. Setup Database Connection

The `DBnx` instance is initialized to establish a connection to the MySQL database.

### Code

```javascript
// database.js
import { DBnx } from "@dbnx/mysql";

// Initialize DBnx instance
export const db = new DBnx({
  host: "localhost",
  user: "root",
  password: "11224455",
  database: "world",
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
}).connect();
```

### Parameters

| Parameter            | Type      | Description                                                  |
| -------------------- | --------- | ------------------------------------------------------------ |
| `host`               | `string`  | MySQL server hostname or IP address.                         |
| `user`               | `string`  | MySQL username.                                              |
| `password`           | `string`  | MySQL password.                                              |
| `database`           | `string`  | Database name.                                               |
| `waitForConnections` | `boolean` | Wait for connections when the pool is full.                  |
| `multipleStatements` | `boolean` | Allow multiple SQL statements in a single query.             |
| `connectionLimit`    | `number`  | Maximum number of connections in the pool.                   |
| `queueLimit`         | `number`  | Maximum number of queued connection requests (0 = no limit). |

---

## 3. Using executeMultiple()

The `executeMultiple()` method executes a sequence of chained queries, such as updating records, retrieving data, inserting new records, and deleting records.

### Example Code

```javascript
// executeQueries.js
import { db } from "./database.js";

async function executeMultipleQueries() {
  try {
    const result = await db
      .update("product", {
        values: { title: "SRAKIB brand" },
        where: "product_id = 1",
      })
      .findAll("product")
      .create("product", {
        title: "test",
      })
      .findOne("product", {
        where: "product_id = 1",
      })
      .delete("product", {
        where: "product_id = 2",
      })
      .executeMultiple();

    console.log("Multiple queries executed successfully:", result);
  } catch (error) {
    console.error("Error executing multiple queries:", error);
  } finally {
    await db.close(); // Close the database connection
  }
}

executeMultipleQueries();
```

---

## 4. Query Methods Breakdown

### update

Updates existing records in a table.

- **Signature**: `update(table: string, params: UpdateParamsType): DBnx`
- **Parameters**:
  - `table`: Table name (e.g., `'product'`).
  - `params.values`: Object with column-value pairs to update.
  - `params.where`: Condition for selecting records.

### findAll

Retrieves all records from a table.

- **Signature**: `findAll(table: string, config?: FindAllParamsType): DBnx`
- **Parameters**:
  - `table`: Table name (e.g., `'product'`).
  - `config`: Optional query configuration (e.g., filters, sorting).

### create

Inserts a new record into a table.

- **Signature**: `create(table: string, values: CreateParamsType): DBnx`
- **Parameters**:
  - `table`: Table name (e.g., `'product'`).
  - `values`: Object with column-value pairs to insert.

### findOne

Retrieves a single record from a table.

- **Signature**: `findOne(table: string, config?: FindOneParamsType): DBnx`
- **Parameters**:
  - `table`: Table name (e.g., `'product'`).
  - `config.where`: Condition for selecting the record.

### delete

Deletes records from a table.

- **Signature**: `delete(table: string, params: DeleteParamsType): DBnx`
- **Parameters**:
  - `table`: Table name (e.g., `'product'`).
  - `params.where`: Condition for selecting records to delete.

### executeMultiple

Executes all queued queries in sequence.

- **Signature**: `executeMultiple(): Promise<ResponseType[]>`
- **Returns**: An array of results from each query.

---

## 5. Error Handling

Wrap the query chain in a `try...catch` block to handle errors gracefully.

### Example

```javascript
try {
  const result = await db
    .update("product", {
      values: { title: "SRAKIB brand" },
      where: "product_id = 1",
    })
    .findAll("product")
    .create("product", { title: "test" })
    .findOne("product", { where: "product_id = 1" })
    .delete("product", { where: "product_id = 2" })
    .executeMultiple();
  console.log("Results:", result);
} catch (error) {
  console.error("Error executing query chain:", error);
}
```

---

## 6. Closing the Connection

Always close the database connection after executing queries to free up resources.

```javascript
await db.close();
```

---

## 7. Example Output

Upon successful execution, the output will resemble:

```plaintext
Multiple queries executed successfully: [
  { /* Update result */ },
  { /* FindAll result */ },
  { /* Create result */ },
  { /* FindOne result */ },
  { /* Delete result */ }
]
```

---

## 8. Best Practices

1. **Use Transactions for Consistency**:

   - Ensure all queries in the chain are executed within a transaction to maintain data integrity.

2. **Validate Input Data**:

   - Sanitize and validate input data (e.g., `values`, `where` conditions) to prevent SQL injection.

3. **Preview Queries**:

   - Use `.build()` to inspect generated SQL queries before execution, especially for complex chains.

4. **Handle Errors Gracefully**:

   - Implement robust error handling to capture and log issues without crashing the application.

5. **Close Connections**:
   - Always close the database connection in the `finally` block to avoid resource leaks.

---
