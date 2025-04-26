"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBnx = void 0;
const mysql2_1 = require("mysql2");
const config_js_1 = require("./config.js");
const handler_js_1 = require("./handler.js");
class DBnx {
  #pool = null;
  #connection = null;
  #dbConfig = null;
  #usePool = false;
  ref = Symbol("ref");
  constructor(...arg) {
    config_js_1.GlobalConfig.logger =
      typeof arg[1] === "function" ? arg[1] : arg[2];
    let usePool = typeof arg[1] == "boolean" ? arg[1] : false;
    let dbConfig = arg[0];
    this.#usePool = usePool;
    this.#dbConfig = dbConfig;
  }
  connect(props) {
    try {
      if (this.#usePool) {
        let pool = (0, mysql2_1.createPool)(this.#dbConfig).promise();
        this.#pool = pool;
        props?.(undefined, "Connection has been established successfully.");
        config_js_1.GlobalConfig.logger_function(
          "✅ Connection has been established successfully.",
        );
        return new handler_js_1.DBnxHandler({ pool: pool }, this.#dbConfig);
      } else {
        let connection = (0, mysql2_1.createConnection)(
          this.#dbConfig,
        ).promise();
        this.#connection = connection;
        props?.(undefined, "Connection has been established successfully.");
        config_js_1.GlobalConfig.logger_function(
          "✅ Connection has been established successfully.",
        );
        return new handler_js_1.DBnxHandler(
          { connection: connection },
          this.#dbConfig,
        );
      }
    } catch (error) {
      config_js_1.GlobalConfig.logger_function(`❌ Error: ${error}`);
      props?.(error, undefined);
      return new handler_js_1.DBnxHandler({}, this.#dbConfig);
    }
  }
}
exports.DBnx = DBnx;
exports.default = DBnx;
