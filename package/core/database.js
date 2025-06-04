import { createConnection, createPool } from "mysql2";
import { GlobalConfig } from "./config.js";
import { DBnxHandler } from "./handler.js";
export class DBnx {
    #pool = null;
    #connection = null;
    #dbConfig = null;
    #usePool = false;
    ref = Symbol("ref");
    constructor(...arg) {
        GlobalConfig.logger = typeof arg[1] === "function" ? arg[1] : arg[2];
        let usePool = typeof arg[1] == "boolean" ? arg[1] : false;
        let dbConfig = arg[0];
        this.#usePool = usePool;
        this.#dbConfig = dbConfig;
    }
    connect(props) {
        try {
            if (this.#usePool) {
                let pool = createPool(this.#dbConfig).promise();
                this.#pool = pool;
                props?.(undefined, "Connection has been established successfully.");
                GlobalConfig.logger_function("✅ Connection has been established successfully.");
                return new DBnxHandler({ pool: pool }, this.#dbConfig);
            }
            else {
                let connection = createConnection(this.#dbConfig).promise();
                this.#connection = connection;
                props?.(undefined, "Connection has been established successfully.");
                GlobalConfig.logger_function("✅ Connection has been established successfully.");
                return new DBnxHandler({ connection: connection }, this.#dbConfig);
            }
        }
        catch (error) {
            GlobalConfig.logger_function(`❌ Error: ${error}`);
            props?.(error, undefined);
            return new DBnxHandler({}, this.#dbConfig);
        }
    }
}
export default DBnx;
