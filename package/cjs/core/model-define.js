"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDefine = void 0;
class ModelDefine {
    static database;
    static ddlQuery = "";
    static modelAttributes;
    static tableOptions;
    static dbInstance;
    static tableName;
    static dbTableIdentifier;
    static generateDDL(attributes) {
        const columnsSQL = this.generateColumnsSQL(attributes);
        const tableOptionsSQL = this.getEngineOptions();
        this.ddlQuery = `CREATE TABLE IF NOT EXISTS ${this.dbTableIdentifier} (\n ${columnsSQL}\n) ${tableOptionsSQL}`;
    }
    static generateColumnsSQL(attributes, isAlter = false) {
        let columnsSQL = "";
        let referencesSql = "";
        for (const columnName in attributes) {
            if (!attributes.hasOwnProperty(columnName))
                continue;
            const options = attributes[columnName];
            let columnSQL = `\`${columnName}\``;
            if (options.values &&
                (options?.type == "ENUM" || options?.type == "enum")) {
                columnSQL += ` ENUM(${options.values.map((value) => `'${value}'`).join(", ")})`;
            }
            else {
                columnSQL += ` ${options.type}`;
            }
            if (options.allowNull && options.defaultValue !== undefined) {
                throw Error("Only a default value must be specified");
            }
            if (options.allowNull && !options.defaultValue) {
                columnSQL += " DEFAULT NULL";
            }
            else if (options.allowNull !== undefined &&
                options.defaultValue == undefined) {
                columnSQL += " NOT NULL";
            }
            else if (options.defaultValue !== undefined) {
                const defaultValue = options.defaultValue === null
                    ? "NULL"
                    : options.defaultValue === "CURRENT_TIMESTAMP"
                        ? "CURRENT_TIMESTAMP"
                        : `'${options.defaultValue}'`;
                columnSQL += ` DEFAULT ${defaultValue}`;
            }
            if (options.unique) {
                columnSQL += " UNIQUE";
            }
            if (options.primaryKey)
                columnSQL += " PRIMARY KEY";
            if (options.autoIncrement)
                columnSQL += ` AUTO_INCREMENT`;
            if (options.references) {
                let references = `,\n${isAlter ? " ADD CONSTRAINT " : ""}`;
                if (typeof options.references === "string") {
                    references += options.references;
                }
                else {
                    const { model, key, onDelete, onUpdate } = options.references;
                    if (typeof model === "function" && "tableName" in model) {
                        references += ` FOREIGN KEY (\`${columnName}\`) REFERENCES \`${model.tableName}\` (\`${key}\`)`;
                    }
                    else {
                        references += ` FOREIGN KEY (\`${columnName}\`) REFERENCES \`${model}\` (\`${key}\`)`;
                    }
                    if (onDelete)
                        references += ` ON DELETE ${onDelete}`;
                    if (onUpdate)
                        references += ` ON UPDATE ${onUpdate}`;
                }
                referencesSql += references;
            }
            if (options.onUpdate) {
                columnSQL += ` ON UPDATE ${options.onUpdate}`;
            }
            columnsSQL += (columnsSQL ? ",\n " : "") + columnSQL;
        }
        return columnsSQL + referencesSql;
    }
    static getEngineOptions() {
        return `${this.tableOptions.auto_increment ? `AUTO_INCREMENT = ${this.tableOptions.auto_increment} ` : ""}ENGINE = ${this.tableOptions.engine ?? "InnoDB"}
  DEFAULT CHARSET = ${this.tableOptions.charset || "utf8mb4"}
  COLLATE = ${this.tableOptions.collation || "utf8mb4_unicode_ci"}`;
    }
}
exports.ModelDefine = ModelDefine;
