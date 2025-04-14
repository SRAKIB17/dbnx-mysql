"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBnx = void 0;
const mysql2_1 = require("mysql2");
const model_1 = require("./model");
const query_1 = require("../query");
const utils_1 = require("../utils");
const condition_1 = require("../utils/condition");
class DBnx {
    #pool = null;
    #connection = null;
    #query = "";
    #dbConfig = null;
    #usePool = false;
    #logger = undefined;
    constructor(...arg) {
        this.#logger = typeof arg[1] === "function" ? arg[1] : arg[2];
        this.#usePool = typeof arg[1] == "boolean" ? arg[1] : false;
        this.#dbConfig = arg[0];
    }
    connect(props) {
        try {
            if (this.#usePool) {
                this.#pool = (0, mysql2_1.createPool)(this.#dbConfig).promise();
            }
            else {
                this.#connection = (0, mysql2_1.createConnection)(this.#dbConfig).promise();
            }
            if (props) {
                this.logger_function("✅ Connection has been established successfully.");
                props(undefined, "Connection has been established successfully.");
            }
        }
        catch (error) {
            this.logger_function(`❌ Error: ${error}`);
            if (props) {
                props(error, undefined);
            }
        }
        return this;
    }
    #argumentExecuteParse(...args) {
        let sql;
        let params;
        let additional;
        let responseFn;
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
            if (typeof args[0] == "string") {
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
    async execute(...args) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args);
        const query = sql || this.#query;
        this.logger_function(`🔍 Execute: ${query}`);
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
            throw new Error("Database connection is not initialized.");
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
            this.#query = "";
            if (this.#pool && connection !== this.#connection && connection) {
                await connection.release();
            }
        }
    }
    async executeQuery(...args) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args);
        const query = sql || this.#query;
        this.logger_function(`📜 Execute: ${query}`);
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
            throw new Error("Database connection is not initialized.");
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
            this.#query = "";
            if (this.#pool && connection !== this.#connection && connection) {
                await connection.release();
            }
        }
    }
    define(modelName, attributes, options) {
        const model = class extends model_1.Model {
        };
        model.init(modelName, attributes, this, options);
        return model;
    }
    create(...args) {
        if (args?.length < 2) {
            throw new Error("No arguments provided to 'findFrom'. Expected a table name and/or values.");
        }
        const values = args[1];
        const options = args[2] ?? {};
        if (typeof args[0] === "function" && "tableName" in args[0]) {
            return args[0].create(values, options);
        }
        let table = typeof args[0] === "string" ? args[0] : "";
        if (!table) {
            throw new Error("Expected a table name and/or values.");
        }
        this.#query += (0, query_1.insert)(table, values, options);
        this.logger_function(`🆕 Create into: \`${table}\``);
        return this;
    }
    findAll(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findAll'. Expected a table name or model.");
        }
        let table = "";
        let Config = args[1] ?? {};
        if (typeof args[0] === "function" && "tableName" in args[0]) {
            table = args[0].model;
            return args[0].findAll(Config);
        }
        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += (0, query_1.find)(table, Config);
        this.logger_function(`📋 Find all from: \`${table}\``);
        return this;
    }
    findOne(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'findOne'. Expected a table name or model.");
        }
        let table = "";
        let Config = args[1] ?? {};
        Config.limitSkip = { limit: 1 };
        if (typeof args[0] === "function" && "tableName" in args[0]) {
            table = args[0].model;
            return args[0].findOne(Config);
        }
        if (typeof args[0] === "string") {
            table = args[0];
        }
        else {
            throw new Error("Invalid first argument: must be a table name or a Model class.");
        }
        this.#query += (0, query_1.find)(table, Config);
        this.logger_function(`🔎 Find one from: \`${table}\``);
        return this;
    }
    update(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'update'. Expected a table name or model.");
        }
        let table = "";
        let Props = args[1];
        if (typeof args[0] === "function" && "tableName" in args[0]) {
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
        this.logger_function(`✏️ Update from: \`${table}\``);
        return this;
    }
    delete(...args) {
        if (args.length === 0) {
            throw new Error("No arguments provided to 'delete'. Expected a table name or model.");
        }
        let table = "";
        let Props = args[1] ?? {};
        if (typeof args[0] === "function" && "tableName" in args[0]) {
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
        this.logger_function(`🗑️ Delete from: \`${table}\``);
        return this;
    }
    logger_function(log) {
        if (this.#logger) {
            this.#logger(log);
        }
    }
    get getConfig() {
        let option;
        if (this.#pool) {
            option = (this.#pool?.pool.config).connectionConfig;
        }
        else if (this.#connection) {
            option = this.#connection.config;
        }
        if (option) {
            return option;
        }
        if (typeof this.#dbConfig == "string") {
            return (0, utils_1.parseMySQLUrl)(this.#dbConfig);
        }
        return this.#dbConfig;
    }
    setQuery(query) {
        this.logger_function(`⚙️ Query set: ${query}`);
        this.#query = query;
        return this;
    }
    build() {
        const build_query = this.#query;
        this.#query = "";
        return build_query;
    }
    condition(filters, joinBy = "AND") {
        return (0, condition_1.dbnxCondition)(filters, joinBy);
    }
    async close() {
        if (this.#pool) {
            this.logger_function("⏳ Closing connection pool...");
            await this.#pool.end();
            this.logger_function("✅ Connection pool closed successfully.");
        }
        else if (this.#connection) {
            this.logger_function("⏳ Closing database connection...");
            await this.#connection.end();
            this.logger_function("✅ Database connection closed successfully.");
        }
        else {
            this.logger_function("⚠️ No active connection or pool to close.");
        }
    }
}
exports.DBnx = DBnx;
exports.default = DBnx;
