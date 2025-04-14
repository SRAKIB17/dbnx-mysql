
---

## **DBnx Multiple Execute Query Example with `executeQuery()`**

This documentation provides the step-by-step process of executing multiple database queries using the `DBnx` library. The following methods (`update`, `findAll`, `create`, `delete`) are chained together to execute in a single sequence.

---

### **1. Setup `database.js` (Database Connection Class)**

The `DBnx` instance is initialized in this file, establishing the connection with MySQL.

#### **Code:**

```javascript
// database.js
import { DBnx } from "@dbnx/mysql";

// Create a new DBnx instance to handle database connection.
export const db = new DBnx(
    {
        host: 'localhost',        // Database host
        user: 'root',             // Database username
        password: '11224455',     // Database password
        database: 'world',        // Database name
        waitForConnections: true, // Allow the pool to wait for a connection
        multipleStatements: true, // Allow multiple SQL statements in one query
        connectionLimit: 10,      // Max number of connections in the pool
        queueLimit: 0,            // Unlimited queue size
    },
    // true // Enable connection pooling
);

// Connect to the database
db.connect()
```

---

### **2. Multiple Queries with `executeQuery()`**

In this example, we'll execute the following queries sequentially using the `executeQuery()` method:

1. **Update** a product's title.
2. **Find all** products.
3. **Create** a new product.
4. **Find one** specific product.
5. **Delete** a product.

#### **Code:**

```javascript
// executeQueries.js
import { db } from './database.js';

async function executeMultipleQueries() {
    try {
        // Begin executing multiple queries
        const result = await db
            .update('product', {
                values: {
                    title: 'SRAKIB brand', // New title
                },
                where: 'product_id = 1', // Condition for the update
            })
            .findAll('product') // Retrieve all products
            .create('product', {
                title: 'test', // New product to be created
            })
            .findOne('product', {
                where: 'product_id = 1', // Find one product with product_id = 1
            })
            .delete('product', {
                where: 'product_id = 2', // Delete product with product_id = 2
            })
            .executeQuery(); // Execute all queries in sequence

        console.log('Multiple queries executed successfully:', result);
    } catch (error) {
        console.error('Error executing multiple queries:', error);
    } finally {
        await db.close(); // Close the database connection after execution
    }
}

// Call the function to execute the queries
executeMultipleQueries();
```

---

### **3. Breakdown of Methods**

Here's an explanation of the different query methods used in the example:

#### **`update(table, { values, where })`**

- **Purpose**: Updates existing records in the specified table.
- **Parameters**:
  - **`table`**: Name of the table (e.g., `'product'`).
  - **`values`**: An object containing the column-value pairs to update.
  - **`where`**: The condition to match the records that need to be updated.

#### **`findAll(table)`**

- **Purpose**: Retrieves all records from the specified table.
- **Parameters**:
  - **`table`**: Name of the table (e.g., `'product'`).

#### **`create(table, data)`**

- **Purpose**: Inserts a new record into the specified table.
- **Parameters**:
  - **`table`**: Name of the table (e.g., `'product'`).
  - **`data`**: An object containing the column-value pairs to insert.

#### **`findOne(table, { where })`**

- **Purpose**: Retrieves a single record from the specified table that matches the given condition.
- **Parameters**:
  - **`table`**: Name of the table (e.g., `'product'`).
  - **`where`**: The condition to match the record (e.g., `'product_id = 1'`).

#### **`delete(table, { where })`**

- **Purpose**: Deletes a record from the specified table based on the condition.
- **Parameters**:
  - **`table`**: Name of the table (e.g., `'product'`).
  - **`where`**: The condition to match the record to delete.

#### **`executeQuery()`**

- **Purpose**: Executes all the queued queries in sequence.
- **Returns**: The result of the queries once executed.

---

### **4. Handling Errors**

Make sure to handle errors properly by wrapping the entire process in a `try...catch` block. This will catch any exceptions that occur during the execution of the queries.

#### **Error Handling Example:**

```javascript
try {
    const result = await db
        .update('product', { values: { title: 'SRAKIB brand' }, where: 'product_id = 1' })
        .findAll('product')
        .create('product', { title: 'test' })
        .findOne('product', { where: 'product_id = 1' })
        .delete('product', { where: 'product_id = 2' })
        .executeQuery();
    
    console.log(result);
} catch (error) {
    console.error('Error executing query chain:', error);
}
```

---

### **5. Closing the Connection**

It's important to close the database connection once all queries are executed to free up resources.

```javascript
await db.close();
```

---

### **6. Example Output**

Once the queries are executed successfully, you should see an output similar to this:

```plaintext
Database connected successfully
Multiple queries executed successfully: [/* Array of results from each query */]
```

---
