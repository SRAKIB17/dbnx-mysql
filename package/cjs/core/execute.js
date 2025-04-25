"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = void 0;
const config_js_1 = require("./config.js");
class Execute {
    query = [];
    db;
    ref = Symbol('ref');
    constructor(db, ref = null, query = []) {
        this.db = db;
        this.ref = ref || null;
        this.query = query;
    }
    async execute(...args) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args);
        const query = sql || this.query?.join(" ");
        config_js_1.GlobalConfig.logger_function(`🔍 Execute: ${query}`);
        if (!query) {
            throw new Error("No query to execute.");
        }
        let connection;
        if (this.db.pool) {
            connection = await this.db.pool?.getConnection();
        }
        else if (this.db.connection) {
            connection = this.db.connection;
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
            this.query = [];
            if (this.db.pool && connection !== this.db.connection && connection) {
                await connection.release();
            }
        }
    }
    async executeMultiple(...args) {
        const { sql, additional, params, responseFn } = this.#argumentExecuteParse(...args);
        const query = sql || this.query?.join(" ");
        config_js_1.GlobalConfig.logger_function(`📜 Execute: ${query}`);
        if (!query) {
            throw new Error("No query to execute.");
        }
        let connection;
        if (this.db.pool) {
            connection = await this.db.pool?.getConnection();
        }
        else if (this.db.connection) {
            connection = this.db.connection;
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
            this.query = [];
            if (this.db.pool && connection !== this.db.connection && connection) {
                await connection.release();
            }
        }
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
}
exports.Execute = Execute;
