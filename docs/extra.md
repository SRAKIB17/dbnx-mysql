Here's a complete implementation for **all CRUD operations** using `dbHandler` and `Model`, including utility functions for create, read, update, and delete operations.

---

### **CRUD Operations with `dbHandler`**

---

#### **1. Create Operation**

Insert data into a database table with constraints like unique column handling.

```typescript
const user = await dbHandler.create('user', [{
    username: 'example_user',
    created_at: null, // Optional
}], { uniqueColumn: 'username' }).execute();

console.log('Created user:', user);
```

- **Parameters**:
  - `table`: The name of the table (e.g., `'user'`).
  - `values`: An array of objects to insert.
  - `options`:
    - `uniqueColumn`: Ensures a unique constraint on the specified column.

---

#### **2. Read Operation**

Fetch records using filters.

```typescript
const users = await dbHandler.read(User, {
    where: "username = 'example_user'",
    limit: 10,
    offset: 0,
    orderBy: "created_at DESC",
});

console.log('Fetched users:', users);
```

- **Parameters**:
  - `where`: SQL `WHERE` clause.
  - `limit`: Maximum number of records to fetch.
  - `offset`: Number of records to skip.
  - `orderBy`: SQL `ORDER BY` clause.

---

#### **3. Update Operation**

Update existing records in a table.

```typescript
const updatedUser = await dbHandler.update(User, {
    set: { username: 'updated_user' },
    where: "username = 'example_user'",
});

console.log('Updated user:', updatedUser);
```

- **Parameters**:
  - `set`: Object containing columns and their new values.
  - `where`: SQL `WHERE` clause to specify rows to update.

---

#### **4. Delete Operation**

Delete records matching specific criteria.

```typescript
const deletedRows = await dbHandler.delete(User, {
    where: "username = 'example_user'",
});

console.log('Deleted rows:', deletedRows);
```

- **Parameters**:
  - `where`: SQL `WHERE` clause.

---

#### **5. Custom SQL Execution**

Run raw SQL queries for advanced use cases.

```typescript
const customQuery = `SELECT * FROM users WHERE username = 'example_user'`;
const result = await dbHandler.execute(customQuery);

console.log('Custom query result:', result);
```

---

### **Utility Functions for Enhanced Operations**

---

#### **1. Batch Insert**

Insert multiple records in bulk with error handling for duplicates.

```typescript
async function batchInsert(model, records) {
    for (const record of records) {
        try {
            await model.insertInto({ values: record, uniqueColumn: 'username' }).execute();
        } catch (error) {
            console.error(`Error inserting record: ${record}`, error);
        }
    }
}

batchInsert(User, [
    { username: 'user1' },
    { username: 'user2' },
]);
```

---

#### **2. Find or Create**

Find a record by specific criteria or create it if not found.

```typescript
async function findOrCreate(model, findCriteria, createData) {
    const found = await model.findOne({ where: findCriteria });
    if (found) return found;

    return await model.create(createData);
}

const user = await findOrCreate(User, { username: 'user1' }, { username: 'user1' });
console.log('User:', user);
```

---

#### **3. Soft Delete**

Add a `deleted_at` timestamp instead of removing the record permanently.

```typescript
async function softDelete(model, whereClause) {
    return await model.update({
        set: { deleted_at: new Date().toISOString() },
        where: whereClause,
    });
}

await softDelete(User, "username = 'user1'");
```

---

#### **4. Sanitize Input**

Prevent SQL injection by sanitizing inputs.

```typescript
function sanitizeInput(input) {
    const sqlInjectionRegex = /(\b(SELECT|UPDATE|INSERT|DELETE|DROP|ALTER|TRUNCATE|GRANT|REVOKE|EXEC|UNION|--|#|\/\*|\*\/)\b|\b(OR|AND)\b.*\=|(\;|\-\-|\#|\/\*))/i;
    if (sqlInjectionRegex.test(input)) {
        throw new Error("Potential SQL injection detected!");
    }
    return input;
}
```

---

#### **5. Paginated Read**

Fetch records with pagination.

```typescript
async function fetchPaginated(model, page, pageSize) {
    const offset = (page - 1) * pageSize;
    const data = await model.findMany({
        limit: pageSize,
        offset,
        orderBy: "created_at DESC",
    });
    return data;
}

const paginatedUsers = await fetchPaginated(User, 1, 10);
console.log('Paginated users:', paginatedUsers);
```

---

### **Hooks for Custom Logic**

Add hooks to execute logic before or after database actions.

```typescript
User.addHook('beforeCreate', (user) => {
    console.log('Before creating:', user);
    user.created_at = new Date().toISOString(); // Auto-set timestamp
});

User.addHook('afterCreate', (result) => {
    console.log('After creating:', result);
});
```

---

### **Advanced Examples**

#### **Dynamic Query Building**

Use dynamic parameters for building queries.

```typescript
const dynamicRead = await dbHandler.read(User, {
    where: `username LIKE '%${sanitizeInput('example')}%'`,
    limit: 5,
});

console.log('Dynamic read result:', dynamicRead);
```

#### **Transaction Management**

Run operations in a transaction for atomicity.

```typescript
await dbHandler.transaction(async (transaction) => {
    await User.create({ username: 'new_user' }, { transaction });
    await Product.create({ title: 'new_product' }, { transaction });
});
```

---

This provides a robust set of operations for working with your database using `dbHandler` and `Model`. You can extend and customize it further based on your application's requirements.
