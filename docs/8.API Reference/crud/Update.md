### API Reference for `update` Method

This reference explains the usage of the `update` method, including parameters, response, examples, and possible errors.

---

### **`update` Method**

#### **Method Signature**

```typescript
public update<tables extends string[]>(table: string, Props: UpdateParamsType<tables>): MySQLHandler;
public update<tables extends string[]>(model: typeof Model, Props: UpdateParamsType<tables>): Promise<ResponseType>;
public update(...args: any): MySQLHandler | Promise<ResponseType>;
```

#### **Description**

The `update` method is used to update existing records in a table or model. The update is performed based on the conditions provided in the parameters. You can specify fields to update, conditions to match, sorting, and other query modifiers.

---

### **Parameters**

1. **`table`** (required)  
   - Type: `string`  
   - Description: The name of the table where records will be updated.  
   - Example: `"users"`, `"products"`

2. **`model`** (required for Model-based queries)  
   - Type: `typeof Model`  
   - Description: The model class (e.g., `User`, `Product`) if you prefer querying through the ORM model rather than using the table name directly.  
   - Example: `User`, `Product`

3. **`Props`** (required)  
   - Type: `UpdateParamsType<tables>`  
   - Description: The parameters for the update operation, including columns to update, conditions, sorting, and other options.  
   - Example:

     ```typescript
     {
       values: { 
         age: 30, 
         name: "John" 
       },
       where: "id = 5",
       sort: { name: "ASC" },
       limit: 10,
       joins: { table: "orders", on: "users.id = orders.user_id" }
     }
     ```

---

### **Response**

- **When a table name is provided**:  
  - Returns an instance of `MySQLHandler`, which is the query builder.
  
- **When a model class is provided**:  
  - Returns a `Promise<ResponseType>` with the result of the update operation executed on the database.

---

### **Details of `UpdateParamsType`**

```typescript
export type UpdateParamsType<Tables extends string[]> = {
    values?: { // The data to update
        [key: string]: string | number | null | { 
            case: { 
                when: string;  // The condition in the WHEN clause
                then: any;     // The value to set in the THEN clause
            }[];  // The CASE structure with an array of WHEN/THEN conditions
            default: any;  // The default value for the column when no conditions match
        };
    },
    sort?: { [P in Tables[number]]?: Record<string, 1 | -1> } | Record<string, 1 | -1> | string,
    where: string,   // The condition to identify which rows to update
    defaultValues?: string[], // Optional: Columns to set to default values
    limit?: string | number,  // Optional: Limits the number of records to update
    joins?: JoinsType<Tables>, // Optional: Join conditions for the update query
    fromSubQuery?: Record<string, string>, // Optional: Subqueries for the update operation
    setCalculations?: { // For SET calculation
        [key: string]: string; // Expressions to calculate new values
    }
}
```

- **`values`**: Specifies the columns to be updated. It can include:
  - Direct values (e.g., `{ age: 30, name: "John" }`).
  - Complex `CASE` structures with conditions and default values.

- **`sort`**: Sorting options for the query (e.g., `{ name: "ASC" }`).

- **`where`**: The condition for selecting the rows to be updated (e.g., `"id = 5"`).

- **`defaultValues`**: Columns to be set to their default values.

- **`limit`**: Limits the number of records to update.

- **`joins`**: Specifies join conditions if the update operation involves multiple tables.

- **`fromSubQuery`**: Allows the use of a subquery for the update operation.

- **`setCalculations`**: Allows you to specify calculations to set the new values (e.g., `{ total_price: "quantity * unit_price" }`).

---

### **Examples**

#### Example 1: Updating records using a table name

```typescript
const query = update('users', {
    values: { age: 30, name: "John" },
    where: "id = 5",
    sort: { name: "ASC" },
    limit: 10,
    joins: { table: "orders", on: "users.id = orders.user_id" }
});
console.log(query);  // The resulting UPDATE SQL query string
```

#### Example 2: Updating records using a model

```typescript
const result = await User.update({
    values: { age: 30, name: "John" },
    where: "id = 5",
    sort: { name: "ASC" },
    limit: 10
});
console.log(result);  // Result of the update operation
```

---

### **Errors**

- **Missing arguments**: If no arguments are provided or if the arguments are invalid, an error will be thrown.
  
  Example:

  ```typescript
  // Missing table name or model
  update();
  // Error: No arguments provided to 'update'. Expected a table name or model.
  ```

- **Invalid first argument**: The first argument must be either a table name (string) or a model class.

  Example:

  ```typescript
  // Invalid argument type
  update(123, { where: "id = 5" });
  // Error: Invalid first argument: must be a table name or a Model class.
  ```

- **Props must be a non-empty object**: If `Props` is not provided or is not an object, an error will be thrown.

  Example:

  ```typescript
  // Invalid props
  update('users', "where: id = 5");
  // Error: Props must be a non-empty object.
  ```

---

### **Internal Methods**

- **`update` function**: This function constructs the actual SQL `UPDATE` query based on the provided parameters.
- **`parseJoins` function**: Parses and formats the `joins` parameter into SQL JOIN clauses.
- **`parseSort` function**: Parses and formats the `sort` parameter into SQL ORDER BY clauses.

---

### **Use Case**

Use the `update` method when you need to modify existing records in a table, with various conditions and sorting. It can be used with both direct table names or ORM-based models. This method supports advanced features like `CASE` expressions, sorting, joining multiple tables, and limiting the number of records affected.
