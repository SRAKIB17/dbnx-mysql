
## **Create a Model**

```ts
const dbHandler = new MySQLHandler(
    {
        host: 'localhost',
        user: 'root',
        password: '11224455',
        database: 'world',
        waitForConnections: true,
        multipleStatements: true,
        connectionLimit: 10,
        queueLimit: 0,
    },
    // true // Use pool
); // DEFAULT connection(false)


```

### **Use dbHandler**

```ts
const User = dbHandler.define('User', {
    username: {
        defaultValue: null,
        type: "VARCHAR(50)",
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: "TIMESTAMP",
        defaultValue: "CURRENT_TIMESTAMP",
    },
});
```

**or**

```ts
import {Model} from "testings";

const Product = Model.init('Product', {
    product_id: {
        type: "BIGINT",
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },

    title: {
        type: "VARCHAR(255)",
        defaultValue: null,
    },

    created_at: {
        type: "TIMESTAMP",
        defaultValue: "CURRENT_TIMESTAMP",
    },
    updated_at: {
        type: 'TIMESTAMP',
        allowNull: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    }
}, dbHandler);

```
