"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBnx = void 0;
const mysql2_1 = require("mysql2");
const promise_1 = __importDefault(require("mysql2/promise"));
const model_1 = require("./model");
const query_1 = require("./query");
class DBnx {
    #pool = null;
    #connection = null;
    #query = ""; // Store the current query
    #dbConfig = null;
    #usePool = false;
    constructor(dbConfig, usePool = false) {
        this.#usePool = usePool;
        this.#dbConfig = dbConfig;
        // if (usePool) {
        //     this.#pool = mysql.createPool(dbConfig as PoolOptions);
        // }
        // else {
        //     this.#connection = createConnection(dbConfig as ConnectionOptions).promise()
        // }
    }
    connect(props) {
        try {
            if (this.#usePool) {
                this.#pool = promise_1.default.createPool(this.#dbConfig);
            }
            else {
                this.#connection = (0, mysql2_1.createConnection)(this.#dbConfig).promise();
            }
            if (props) {
                props(undefined, "Connection has been established successfully.");
            }
        }
        catch (error) {
            if (props) {
                props(error, undefined);
            }
        }
    }
    #argumentExecuteParse(...args) {
        let sql;
        let params;
        let additional;
        let responseFn;
        // Argument parsing logic
        if (args.length === 4) {
            [sql, params, additional, responseFn] = args;
        }
        else if (args.length === 3) {
            if (typeof args[0] === "string" && Array.isArray(args[1])) {
                [sql, params, additional] = args;
            }
            else {
                [sql, additional, responseFn] = args;
            }
        }
        else if (args.length === 2) {
            if (typeof args[0] === "string") {
                sql = args[0];
                if (Array.isArray(args[1])) {
                    params = args[1];
                }
                else if (typeof args[1] === "object") {
                    additional = args[1];
                }
                else if (typeof args[1] === "function") {
                    responseFn = args[1];
                }
            }
            else {
                additional = args[0];
                responseFn = args[1];
            }
        }
        else if (args.length === 1) {
            if (typeof args[0] == 'string') {
                sql = args[0];
            }
            else if (typeof args[0] === "function") {
                responseFn = args[0];
            }
            else if (typeof args[0] === "object") {
                additional = args[0];
            }
        }
        return { sql, params, additional, responseFn };
    }
    // Implementation
    async execute(...args) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args);
        const query = sql || this.#query;
        if (!query) {
            throw new Error("No query to execute.");
        }
        let connection;
        if (this.#pool) {
            connection = await this.#pool?.getConnection();
        }
        else if (this.#connection) {
            connection = this.#connection;
        }
        else {
            throw new Error('Database connection is not initialized.');
        }
        try {
            const [rows, fields] = await connection?.execute(query, params);
            const data = {
                success: true,
                result: rows,
                ...additional,
            };
            if (responseFn) {
                return responseFn(data);
            }
            return data;
        }
        catch (err) {
            const errorData = {
                result: [],
                errno: err?.errno,
                success: false,
                error: err instanceof Error ? err.message : String(err),
            };
            if (responseFn) {
                return responseFn(errorData);
            }
            return errorData;
        }
        finally {
            this.#query = '';
            if (this.#pool && connection !== this.#connection && connection) {
                await connection.release();
            }
        }
    }
    // Implementation
    async executeQuery(...args) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args);
        const query = sql || this.#query;
        if (!query) {
            throw new Error("No query to execute.");
        }
        let connection;
        if (this.#pool) {
            connection = await this.#pool?.getConnection();
        }
        else if (this.#connection) {
            connection = this.#connection;
        }
        else {
            throw new Error('Database connection is not initialized.');
        }
        try {
            const [rows, fields] = await connection?.query(query, params);
            const data = {
                success: true,
                result: rows,
                ...additional,
            };
            if (responseFn) {
                return responseFn(data);
            }
            return data;
        }
        catch (err) {
            const errorData = {
                result: [],
                errno: err?.errno,
                success: false,
                error: err instanceof Error ? err.message : String(err),
            };
            if (responseFn) {
                return responseFn(errorData);
            }
            return errorData;
        }
        finally {
            this.#query = '';
            if (this.#pool && connection !== this.#connection && connection) {
                await connection.release();
            }
        }
    }
    define(modelName, attributes, options) {
        const model = class extends model_1.Model {
        };
        Object.defineProperty(model, 'name', { value: modelName });
        model.init(modelName, attributes, this, options);
        return model;
    }
    create(...args) {
        if (args?.length < 2) {
            throw new Error("No arguments provided to 'findFrom'. Expected a table name and/or values.");
        }
        const values = args[1];
        const options = args[2] ?? {};
        if (typeof args[0] === 'function' && 'model' in args[0]) {
            return args[0].create(values, options);
        }
        let table = typeof args[0] === 'string' ? args[0] : '';
        if (!table) {
            throw new Error("Expected a table name and/or values.");
        }
        this.#query += (0, query_1.insertInto)(table, values, options);
        return this;
    }
    findAll(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findAll'. Expected a table name or model.");
        }
        let table = '';
        let Config = args[1] ?? {};
        if (typeof args[0] === "function" && "model" in args[0]) {
            // Case 2: First argument is a Model class
            table = args[0].model;
            return args[0].findAll(Config);
        }
        if (typeof args[0] === "string") {
            // Case 1: First argument is a table name
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += (0, query_1.findingQuery)(table, Config);
        return this;
    }
    findOne(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findOne'. Expected a table name or model.");
        }
        let table = '';
        let Config = args[1] ?? {};
        Config.limitSkip = { limit: 1 };
        if (typeof args[0] === "function" && "model" in args[0]) {
            // Case 2: First argument is a Model class
            table = args[0].model;
            return args[0].findOne(Config);
        }
        if (typeof args[0] === "string") {
            // Case 1: First argument is a table name
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += (0, query_1.findingQuery)(table, Config);
        return this;
    }
    update(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'update'. Expected a table name or model.");
        }
        let table = '';
        let Props = args[1] ?? {};
        if (typeof args[0] === "function" && "model" in args[0]) {
            table = args[0].model;
            return args[0].update(Props);
        }
        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += (0, query_1.update)(table, Props);
        return this;
    }
    delete(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'delete'. Expected a table name or model.");
        }
        let table = '';
        let Props = args[1] ?? {};
        if (typeof args[0] === "function" && "model" in args[0]) {
            table = args[0].model;
            return args[0].delete(Props);
        }
        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += (0, query_1.destroy)(table, Props);
        return this;
    }
    /**
     * Fetch all configurations used in the connection or pool.
     * @returns Object containing configuration details.
     */
    getConfig() {
        if (this.#pool) {
            return this.#pool.config;
        }
        else if (this.#connection) {
            return this.#connection.config;
        }
        return null;
    }
    setQuery(query) {
        this.#query = query;
        return this;
    }
    // Build method that returns the query and resets it
    build() {
        const build_query = this.#query; // Store the current query in `x`
        this.#query = ''; // Reset the query
        return build_query; // Return the original query
    }
    sync() {
        return 34534;
    }
    async close() {
        if (this.#pool) {
            await this.#pool.end();
        }
        else if (this.#connection) {
            await this.#connection.end();
        }
    }
}
exports.DBnx = DBnx;
// const dbHandler = new MySQLHandler(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: '11224455',
//         database: 'world',
//         waitForConnections: true,
//         multipleStatements: true,
//         connectionLimit: 10,
//         queueLimit: 0,
//     },
//     // true // Use pool
// );
// Example Usage
// (async () => {
//     try {
//         const x = await dbHandler.insertInto({
//             table: 'users',
//             dateFields: ['createdAt', 'updatedAt'],
//             uniqueColumn: 'email',
//             values: {
//                 name: 23423,
//                 email: 'rakibulssc5@gmail.com'
//             }
//         }).insertInto({
//             table: 'users',
//             dateFields: ['createdAt', 'updatedAt'],
//             uniqueColumn: 'email',
//             values: {
//                 name: 23423,
//                 email: 'rakibuxlsscxxxxxxx5@gmail.com'
//             }
//         }).executeQuery({
//             additional: { succcess: true }, responseFn: (d) => {
//             }
//         })
//         console.log(x)
//         // const result = await dbHandler.selectQuery({
//         //     table: 'country',
//         // });
//         // console.log(result)
//         // // console.log(result);
//         // console.log('Config:', dbHandler.getConfig());
//     }
//     catch (error: any) {
//         console.error(error.message);
//     } finally {
//         await dbHandler.close();
//     }
// })();
