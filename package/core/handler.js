import { GlobalConfig } from "./config.js";
import { Query } from "./query.js";
import { dbnxCondition, parseMySQLUrl } from "../utils/index.js";
import { Model } from "./model.js";
export class DBnxHandler extends Query {
  #dbConfig = null;
  constructor(db, dbConfig) {
    super(db);
    this.#dbConfig = dbConfig;
  }
  get getConfig() {
    let option;
    if (this.db.pool) {
      option = (this.db.pool?.pool.config).connectionConfig;
    } else if (this.db.connection) {
      option = this.db.connection.config;
    }
    if (option) {
      return option;
    }
    if (typeof this.#dbConfig == "string") {
      return parseMySQLUrl(this.#dbConfig);
    }
    return this.#dbConfig;
  }
  define(modelName, attributes, options) {
    const model = class extends Model {};
    Object.defineProperty(model, "name", { value: modelName });
    model.init(modelName, attributes, this, options);
    return model;
  }
  async close() {
    if (this.db.pool) {
      GlobalConfig.logger_function("⏳ Closing connection pool...");
      await this.db.pool.end();
      GlobalConfig.logger_function("✅ Connection pool closed successfully.");
    } else if (this.db.connection) {
      GlobalConfig.logger_function("⏳ Closing database connection...");
      await this.db.connection.end();
      GlobalConfig.logger_function(
        "✅ Database connection closed successfully.",
      );
    } else {
      GlobalConfig.logger_function("⚠️ No active connection or pool to close.");
    }
  }
  condition(filters, joinBy = "AND") {
    return dbnxCondition(filters, joinBy);
  }
}
