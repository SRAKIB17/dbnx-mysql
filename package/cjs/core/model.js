"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const query_1 = require("../query");
const config_js_1 = require("./config.js");
const model_define_js_1 = require("./model-define.js");
class Model extends model_define_js_1.ModelDefine {
    static hooks = {};
    constructor(attributes) {
        super();
        Object.assign(this, attributes);
    }
    static init(model, attributes, instance, options = {}) {
        Object.defineProperty(this, "name", { value: model });
        if (!instance) {
            throw new Error("🌋No instance passed Or instance not match");
        }
        if (!model) {
            throw new Error("🚨 Model name is required but not provided.");
        }
        config_js_1.GlobalConfig.logger_function(`✨ Creating model: \`${model}\``);
        this.modelAttributes = attributes;
        const parts = model?.split(".");
        this.database = parts?.length > 1 ? parts[0] : instance.getConfig?.database;
        this.tableName = parts?.[parts.length - 1];
        this.tableOptions = options;
        this.dbInstance = instance;
        this.dbTableIdentifier = `${this.database ? `${this.database}.` : ""}${this.tableName}`;
        this.generateDDL(attributes);
        return this;
    }
    static async create(...args) {
        let values = args[0];
        let options = args[1] || {};
        if (!values || typeof values !== "object" || !Object.keys(values).length) {
            throw new Error("Values must be a non-empty object.");
        }
        const result = await this.dbInstance.execute((0, query_1.insert)(this.dbTableIdentifier, values, options));
        config_js_1.GlobalConfig.logger_function(`🆕 Create into: \`${this.dbTableIdentifier}\``);
        return result;
    }
    static async findAll(Config) {
        if (Config && typeof Config !== "object") {
            throw new Error("Config must be a non-empty object.");
        }
        config_js_1.GlobalConfig.logger_function(`📋 Find all from: \`${this.dbTableIdentifier}\``);
        const result = await this.dbInstance.execute((0, query_1.find)(this.dbTableIdentifier, Config));
        return result;
    }
    static async findOne(Config) {
        if (Config && typeof Config !== "object") {
            throw new Error("Config must be a non-empty object.");
        }
        config_js_1.GlobalConfig.logger_function(`🔎 Find one from: \`${this.dbTableIdentifier}\``);
        let config = Config ?? {};
        config.limitSkip = { limit: 1 };
        const result = await this.dbInstance.execute((0, query_1.find)(this.dbTableIdentifier, config));
        return result;
    }
    static async update(Props) {
        if (typeof Props !== "object") {
            throw new Error("Props must be a non-empty object.");
        }
        config_js_1.GlobalConfig.logger_function(`✏️ Update from: \`${this.dbTableIdentifier}\``);
        const result = await this.dbInstance.execute((0, query_1.update)(this.dbTableIdentifier, Props));
        return result;
    }
    static async delete(Props) {
        if (typeof Props !== "object") {
            throw new Error("Props must be a non-empty object.");
        }
        config_js_1.GlobalConfig.logger_function(`🗑️ Delete from: \`${this.dbTableIdentifier}\``);
        const result = await this.dbInstance.execute((0, query_1.destroy)(this.dbTableIdentifier, Props));
        return result;
    }
    static async getColumnMetadata() {
        const db = await this.dbInstance.execute(`
SELECT 
    c.COLUMN_NAME AS \`field\`,
    c.COLUMN_TYPE AS \`type\`,
    c.IS_NULLABLE AS \`null\`,
    c.COLUMN_KEY AS \`key\`,
    c.COLUMN_DEFAULT AS \`default\`,
    c.EXTRA AS \`extra\`,
    kcu.CONSTRAINT_NAME as constraintName
FROM
    INFORMATION_SCHEMA.COLUMNS c
        LEFT JOIN
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON c.COLUMN_NAME = kcu.COLUMN_NAME
        AND c.TABLE_NAME = kcu.TABLE_NAME
        AND c.TABLE_SCHEMA = kcu.TABLE_SCHEMA
WHERE
    c.TABLE_NAME = '${this.tableName}'
    AND c.TABLE_SCHEMA = '${this.database}'
       `);
        return db?.result;
    }
    static async listConstraints() {
        const query = `
SELECT
    CONSTRAINT_NAME AS constraintName,
    CONSTRAINT_TYPE AS constraintType
FROM
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE
    TABLE_NAME = '${this.tableName}'
        AND TABLE_SCHEMA = '${this.database}'
          `;
        return (await this.dbInstance.execute(query))?.result;
    }
    static async dropTableConstraints() {
        const constraintList = await this.listConstraints();
        if (!constraintList?.length) {
            return;
        }
        const constraintsQuery = new Set();
        const columnMetadata = await this.getColumnMetadata();
        columnMetadata
            ?.filter((r) => r?.key === "PRI")
            ?.forEach((r) => {
            const defaultValue = r?.default
                ? ` DEFAULT ${r?.default}`
                : r?.null === "YES"
                    ? " DEFAULT NULL"
                    : "";
            constraintsQuery.add(`MODIFY COLUMN ${r?.field} ${r?.type}${defaultValue}`);
        });
        if (constraintList?.length) {
            console.log("\x1b[36m%s\x1b[0m", "Constraints to drop:", this.dbTableIdentifier);
            console.table(constraintList);
        }
        for (const constraint of constraintList) {
            const { constraintName, constraintType } = constraint;
            switch (constraintType) {
                case "PRIMARY KEY":
                    constraintsQuery.add(`DROP PRIMARY KEY`);
                    break;
                case "FOREIGN KEY":
                    constraintsQuery.add(`DROP FOREIGN KEY ${constraintName}`);
                    break;
                case "UNIQUE":
                    constraintsQuery.add(`DROP INDEX ${constraintName}`);
                    break;
                case "CHECK":
                    console.warn("\x1b[33m%s\x1b[0m", `CHECK constraints cannot be dropped directly. Consider alternative handling.`);
                    break;
                case "DEFAULT":
                case "NOT NULL":
                    console.log(`Attempting to drop ${constraintType} on ${constraintName}`);
                    const column = columnMetadata.find((col) => col.field === constraintName);
                    if (column) {
                        const definition = `${column.type}${column.null === "YES" ? " NULL" : " NOT NULL"}`;
                        constraintsQuery.add(`MODIFY COLUMN ${column.field} ${definition}`);
                    }
                    break;
                default:
                    throw new Error(`Unknown constraint type: ${constraintType}`);
            }
        }
        if (constraintsQuery.size) {
            const query = `ALTER TABLE ${this.dbTableIdentifier}\n${[...constraintsQuery].join(",\n")}`;
            console.log("\x1b[36m%s\x1b[0m", `Executing Query:\n${query}`);
            const result = await this.dbInstance.execute(query);
            if (!result?.success)
                this.errorHandle(result);
        }
    }
    static async drop() {
        config_js_1.GlobalConfig.logger_function(`🗑️ Dropping table: \`${this.dbTableIdentifier}\``);
        await this.dropTableConstraints();
        const query = `DROP TABLE IF EXISTS ${this.dbTableIdentifier}`;
        config_js_1.GlobalConfig.logger_function(`📜 Executing query: ${query}`);
        const data = await this.dbInstance.execute(query);
        config_js_1.GlobalConfig.logger_function(`✅ Table \`${this.dbTableIdentifier}\` dropped successfully.`);
        return this.errorHandle(data);
    }
    static async sync(force = false) {
        config_js_1.GlobalConfig.logger_function(`🔄 Starting  model synchronization...`);
        config_js_1.GlobalConfig.logger_function(`🛠️ Synchronizing model: \`${this.dbTableIdentifier}\``);
        await this.dropTableConstraints();
        if (force) {
            config_js_1.GlobalConfig.logger_function("🚀 Force sync enabled. Dropping the table and re-creating it...");
            await this.drop();
            config_js_1.GlobalConfig.logger_function("✅ Model table re-created successfully.");
            return this.errorHandle(await this.dbInstance.execute(this.ddlQuery));
        }
        const columnData = (await this.getColumnMetadata())?.reduce((acc, curr) => {
            acc[curr?.field] = curr;
            return acc;
        }, {});
        if (typeof columnData !== "object" ||
            Object.keys(columnData)?.length === 0) {
            config_js_1.GlobalConfig.logger_function("⚠️ No existing table or metadata found. Re-creating the table...");
            await this.drop();
            config_js_1.GlobalConfig.logger_function("✅ Model table created successfully.");
            return this.errorHandle(await this.dbInstance.execute(this.ddlQuery));
        }
        let query = `ALTER TABLE ${this.dbTableIdentifier}\n${this.getEngineOptions()}`;
        let modifyColumn = [];
        for (const key in this.modelAttributes) {
            if (!this.modelAttributes.hasOwnProperty(key))
                continue;
            const value = this.modelAttributes[key];
            if (value?.modifyColumn && value?.modifyColumn in columnData) {
                modifyColumn.push(value?.modifyColumn);
                query += `,\n CHANGE COLUMN \`${value?.modifyColumn}\` ${this.generateColumnsSQL({ [key]: value }, true)}`;
            }
            else if (key in columnData) {
                query += `,\n MODIFY COLUMN ${this.generateColumnsSQL({ [key]: value }, true)}`;
            }
            else {
                query += `,\n ADD COLUMN ${this.generateColumnsSQL({ [key]: value }, true)}`;
            }
        }
        for (const existingKey in columnData) {
            if (!(existingKey in this.modelAttributes) &&
                !modifyColumn?.includes(existingKey)) {
                query += `,\n DROP COLUMN \`${existingKey}\``;
            }
        }
        const data = await this.dbInstance.execute(query);
        config_js_1.GlobalConfig.logger_function("✅ Table synchronized successfully.");
        return this.errorHandle(data);
    }
    static errorHandle(data) {
        if (!data?.success) {
            throw Error(data.error);
        }
        return data;
    }
}
exports.Model = Model;
