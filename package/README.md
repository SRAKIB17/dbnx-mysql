
---

# **DBnx/mysql**

<https://dbnx-mysql.vercel.app>

A lightweight and flexible TypeScript-based database query and manipulation library. Designed to simplify database interactions with a clean and intuitive API.

---

## **Features**

- 🛠 **Flexible Queries**: Perform complex queries with simple methods.
- 🗃 **Model Integration**: Seamlessly interact with database models.
- ✏️ **CRUD Operations**: Create, Read, Update, and Delete records easily.
- 🔒 **Type Safety**: TypeScript support for strong type checking.
- ⚡ **Performance**: Optimized for high-speed database operations.

---

## **Installation**

Install `DBnx` using npm:

```bash
npm install @dbnx/mysql
```

---

## **Usage**

### **1. Initialize DBnx**

Start by initializing the `DBnx` instance:

```typescript
import {DBnx} from '@dbnx/mysql';

const dbnx = new DBnx({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'your_database',
});
```

---

## **API Reference**

### **DBnx Initialization**

```typescript
new DBnx(config: DBConfigType)
```

| Parameter      | Type     | Description                            |
|----------------|----------|----------------------------------------|
| `host`         | `string` | Database host URL                     |
| `user`         | `string` | Database user                         |
| `password`     | `string` | Database password                     |
| `database`     | `string` | Name of the database                  |

---

## **Contributing**

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

Feel free to modify this template as per your specific implementation details!
