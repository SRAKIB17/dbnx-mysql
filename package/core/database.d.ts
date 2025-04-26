import { ConnectionOptions, PoolOptions } from "mysql2/promise";
import { DBnxHandler } from "./handler.js";
export declare class DBnx {
  #private;
  ref: symbol;
  constructor(
    dbConfig: ConnectionOptions | PoolOptions | string,
    usePool?: boolean,
    logger?: (log: any) => void,
  );
  constructor(
    dbConfig: ConnectionOptions | PoolOptions | string,
    logger?: (log: any) => void,
  );
  constructor(dbConfig: ConnectionOptions | PoolOptions | string);
  /**
   * Establishes a database connection using either a connection pool or a single connection.
   * @param {function} [props] - Optional callback function for success or error handling.
   * @returns {DBnx} - The current instance of DBnx.
   */
  connect(props?: (err?: any, success?: any) => void): DBnxHandler;
}
export default DBnx;
