import { destroy, find, insert, update } from "../query/index.js";
import { GlobalConfig } from "./config.js";
import { Execute } from "./execute.js";
export class Query extends Execute {
    constructor(db = {}, ref = null, q = []) {
        super(db, ref, q);
    }
    _chain(actionObj) {
        let query = [...this.query, actionObj];
        let instance = new Query(this.db, this.ref, query);
        return instance;
    }
    create(...args) {
        if (args?.length < 2) {
            throw new Error("No arguments provided to 'findFrom'. Expected a table name and/or values.");
        }
        ;
        const values = args[1];
        const options = args[2] ?? {};
        if (typeof args[0] === "function" && "tableName" in args[0]) {
            return args[0].create(values, options);
        }
        let table = typeof args[0] === "string" ? args[0] : "";
        if (!table) {
            throw new Error("Expected a table name and/or values.");
        }
        return this._chain(insert(table, values, options));
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
        return this._chain(find(table, Config));
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
        return this._chain(find(table, Config));
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
        return this._chain(update(table, Props));
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
        return this._chain(destroy(table, Props));
    }
    setQuery(query) {
        GlobalConfig.logger_function(`⚙️ Query set: ${query}`);
        this.query.push(query);
        return this;
    }
    build() {
        const build_query = this.query?.join(" ");
        this.query = [];
        return build_query;
    }
}
