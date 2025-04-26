"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBnxHandler = void 0;
const config_js_1 = require("./config.js");
const query_js_1 = require("./query.js");
const index_js_1 = require("../utils/index.js");
const model_js_1 = require("./model.js");
class DBnxHandler extends query_js_1.Query {
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
      return (0, index_js_1.parseMySQLUrl)(this.#dbConfig);
    }
    return this.#dbConfig;
  }
  define(modelName, attributes, options) {
    const model = class extends model_js_1.Model {};
    Object.defineProperty(model, "name", { value: modelName });
    model.init(modelName, attributes, this, options);
    return model;
  }
  async close() {
    if (this.db.pool) {
      config_js_1.GlobalConfig.logger_function("⏳ Closing connection pool...");
      await this.db.pool.end();
      config_js_1.GlobalConfig.logger_function(
        "✅ Connection pool closed successfully.",
      );
    } else if (this.db.connection) {
      config_js_1.GlobalConfig.logger_function(
        "⏳ Closing database connection...",
      );
      await this.db.connection.end();
      config_js_1.GlobalConfig.logger_function(
        "✅ Database connection closed successfully.",
      );
    } else {
      config_js_1.GlobalConfig.logger_function(
        "⚠️ No active connection or pool to close.",
      );
    }
  }
  condition(filters, joinBy = "AND") {
    return (0, index_js_1.dbnxCondition)(filters, joinBy);
  }
}
exports.DBnxHandler = DBnxHandler;
