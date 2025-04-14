### API Reference for `create` Method

This reference explains the usage of the `create` method, which is used to insert new records into a table or model.

---

### **`create` Method**

#### **Method Signature**

```typescript
public create<tables extends string[]>(table: string, values: CreateParamsType<[]>, options?: CreateOptionsType): MySQLHandler;
public create<tables extends string[]>(model: typeof Model, values: CreateParamsType<[]>, options?: CreateOptionsType): Promise<ResponseType>;
public create(...args: any): MySQLHandler | Promise<ResponseType>;
```

#### **Description**

The `create` method is used to insert new records into a table or model. The method supports both direct table insertion and ORM-based model insertion. It takes the values to be inserted and options that define the insertion behavior.

---

### **Parameters**

1. **`table`** (required)  
   - Type: `string`  
   - Description: The name of the table into which the record will be inserted.  
   - Example: `"users"`, `"products"`

2. **`model`** (required for Model-based queries)  
   - Type: `typeof Model`  
   - Description: The model class (e.g., `User`, `Product`) if you prefer querying through the ORM model rather than using the table name directly.  
   - Example: `User`, `Product`

3. **`values`** (required)  
   - Type: `CreateParamsType<[]>`  
   - Description: The values to be inserted into the table or model.  
   - Example:

     ```typescript
     {
       name: "John",
       age: 30,
       email: "john@example.com"
     }
     ```

4. **`options`** (optional)  
   - Type: `CreateOptionsType`  
   - Description: Options that define the behavior of the insertion (e.g., `engine`, `charset`, `collation`, `auto_increment`).  
   - Example:

     ```typescript
     {
       engine: "InnoDB",
       charset: "utf8mb4",
       collation: "utf8mb4_unicode_ci",
       auto_increment: 100
     }
     ```

---

### **Response**

- **When a table name is provided**:  
  - Returns an instance of `MySQLHandler`, which is the query builder.
  
- **When a model class is provided**:  
  - Returns a `Promise<ResponseType>` with the result of the insert operation executed on the database.

---

### **Details of `CreateParamsType` and `CreateOptionsType`**

```typescript
export type CreateParamsType<Tables extends string[]> = {
    // Define the fields and their values for inserting new records.
    [key: string]: string | number | boolean | null;
}

export type CreateOptionsType = {
    engine?: Engine;        // Optional: Defines the storage engine (e.g., "InnoDB")
    charset?: Charset;      // Optional: Defines the character set (e.g., "utf8mb4")
    collation?: Collation;  // Optional: Defines the collation (e.g., "utf8mb4_unicode_ci")
    auto_increment?: number; // Optional: Defines the auto-increment value for the primary key
};
```

- **`CreateParamsType`**: This defines the fields and their values that will be inserted into the table. It can include basic types like strings, numbers, booleans, or `null`.

- **`CreateOptionsType`**: This defines additional options for the creation operation, such as the database engine, charset, collation, and auto-increment values for primary keys.

---

### **Examples**

#### Example 1: Inserting a record using a table name

```typescript
const query = create('users', {
    name: "John",
    age: 30,
    email: "john@example.com"
}, {
    engine: "InnoDB",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci"
});
console.log(query);  // The resulting INSERT SQL query string
```

#### Example 2: Inserting a record using a model

```typescript
const result = await User.create({
    name: "John",
    age: 30,
    email: "john@example.com"
}, {
    engine: "InnoDB",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci"
});
console.log(result);  // Result of the insert operation
```

---

### **Errors**

- **Missing arguments**: If no arguments are provided or if the arguments are invalid, an error will be thrown.
  
  Example:

  ```typescript
  // Missing table name or model
  create();
  // Error: No arguments provided to 'create'. Expected a table name and/or values.
  ```

- **Invalid first argument**: The first argument must be either a table name (string) or a model class.

  Example:

  ```typescript
  // Invalid argument type
  create(123, { name: "John", age: 30 });
  // Error: Invalid first argument: must be a table name or a Model class.
  ```

- **Invalid values**: If `values` is not provided or is not an object, an error will be thrown.

  Example:

  ```typescript
  // Invalid values
  create('users', "name: John");
  // Error: Values must be a non-empty object.
  ```

---

### **Internal Methods**

- **`insertInto` function**: This function constructs the actual SQL `INSERT` query based on the provided parameters.
- **`runHooks` function**: If applicable, this can run hooks like `beforeCreate` before executing the insert operation.

---

### **Use Case**

Use the `create` method when you need to insert new records into a table, either directly by specifying the table name or via ORM model classes. You can include additional options such as `charset`, `collation`, and `auto_increment` for advanced table configurations. This method ensures that the insertion operation is performed correctly with the provided data.
