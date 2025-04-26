export declare class DataTypes {
  /**
   * Returns a `STRING` SQL type with a specific size.
   *
   * **What is it?**
   * `STRING` is a variable-length string data type commonly used for textual data.
   *
   * **Params:**
   * - `size` (string | number): Maximum length of the string (default: 250).
   * - Range: `1` to `65535` (depending on row size and other columns).
   *
   * @param {string | number} size - The maximum length of the `VARCHAR` column.
   * @returns {string} - A formatted `VARCHAR` SQL type string.
   */
  static STRING(size?: string | number): string;
  /**
   * Returns a `CHAR` SQL type with a fixed size.
   *
   * **What is it?**
   * `CHAR` is a fixed-length string data type, suitable for data with consistent lengths (e.g., codes, identifiers).
   *
   * **Params:**
   * - `size` (number): Length of the string (default: 35).
   * - Range: `1` to `255`.
   *
   * @param {number} size - Fixed length of the `CHAR` column.
   * @returns {string} - A formatted `CHAR` SQL type string.
   */
  static CHAR(size?: number): string;
  /**
   * Returns a `TEXT` SQL type with a specific type.
   *
   * **What is it?**
   * `TEXT` is used for storing large amounts of textual data. Variants include:
   * - `TINYTEXT` (up to 255 bytes),
   * - `TEXT` (up to 65,535 bytes),
   * - `MEDIUMTEXT` (up to 16,777,215 bytes),
   * - `LONGTEXT` (up to 4,294,967,295 bytes).
   *
   * **Params:**
   * - `type` (`'TINYTEXT' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT'`): The specific text type (default: `'TEXT'`).
   *
   * @param {'TINYTEXT' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT'} type - The variant of `TEXT` to use.
   * @returns {string} - A formatted `TEXT` SQL type string.
   */
  static TEXT(type?: "TINYTEXT" | "TEXT" | "MEDIUMTEXT" | "LONGTEXT"): string;
  /**
   * Returns a `BLOB` SQL type for binary data.
   *
   * **What is it?**
   * `BLOB` is used for storing binary large objects, such as images, videos, or files. Variants include:
   * - `TINYBLOB` (up to 255 bytes),
   * - `BLOB` (up to 65,535 bytes),
   * - `MEDIUMBLOB` (up to 16,777,215 bytes),
   * - `LONGBLOB` (up to 4,294,967,295 bytes).
   *
   * **Params:**
   * - `type` (`"TINYBLOB" | "BLOB" | "MEDIUMBLOB" | "LONGBLOB"`): The specific blob type (default: `"BLOB"`).
   *
   * @param {"TINYBLOB" | "BLOB" | "MEDIUMBLOB" | "LONGBLOB"} type - The variant of `BLOB` to use.
   * @returns {string} - A formatted `BLOB` SQL type string.
   */
  static BLOB(type?: "TINYBLOB" | "BLOB" | "MEDIUMBLOB" | "LONGBLOB"): string;
  /**
   * Returns a `JSON` SQL type.
   *
   * **What is it?**
   * `JSON` is used to store JSON-formatted data, allowing structured data storage.
   *
   * **Params:**
   * None.
   *
   * @returns {string} - A formatted `JSON` SQL type string.
   */
  static JSON(): string;
  /**
   * Returns a `BINARY` SQL type with a fixed size.
   *
   * **What is it?**
   * `BINARY` is a fixed-length binary string. It is used for storing binary data with consistent lengths.
   *
   * **Params:**
   * - `size` (number): Fixed size of the binary string (default: 16).
   * - Range: `1` to `255`.
   *
   * @param {number} size - Fixed length of the `BINARY` column.
   * @returns {string} - A formatted `BINARY` SQL type string.
   */
  static BINARY(size?: number): string;
  /**
   * Returns a `VARBINARY` SQL type with a specific size.
   *
   * **What is it?**
   * `VARBINARY` is a variable-length binary string, used for binary data of varying lengths.
   *
   * **Params:**
   * - `size` (number): Maximum size of the binary string (default: 255).
   * - Range: `1` to `65535`.
   *
   * @param {number} size - Maximum length of the `VARBINARY` column.
   * @returns {string} - A formatted `VARBINARY` SQL type string.
   */
  static VARBINARY(size?: number): string;
  /**
   * Returns a `ENUM` SQL type.
   *
   * **What is it?**
   * A string object that can have only one value, chosen from a list of possible values. You can list up to 65535 values in an ENUM list. If a value is inserted that is not in the list, a blank value will be inserted. The values are sorted in the order you enter them
   *
   * @returns {string} - A formatted `ENUM` SQL type string.
   */
  static ENUM(): string;
  /**
   * Returns a `TINYINT` SQL type.
   *
   * **What is it?**
   * `TINYINT` is a very small integer, with a range of -128 to 127 (signed) or 0 to 255 (unsigned).
   *
   * **Params:**
   * - `unsigned` (boolean): If `true`, creates an unsigned `TINYINT` (default: `false`).
   *
   * @param {boolean} unsigned - Whether the integer is unsigned.
   * @returns {string} - A formatted `TINYINT` SQL type string.
   */
  static TINYINT(unsigned?: boolean): string;
  /**
   * Returns a `SMALLINT` SQL type.
   *
   * **What is it?**
   * `SMALLINT` is a small integer, with a range of -32,768 to 32,767 (signed) or 0 to 65,535 (unsigned).
   *
   * **Params:**
   * - `unsigned` (boolean): If `true`, creates an unsigned `SMALLINT` (default: `false`).
   *
   * @param {boolean} unsigned - Whether the integer is unsigned.
   * @returns {string} - A formatted `SMALLINT` SQL type string.
   */
  static SMALLINT(unsigned?: boolean): string;
  /**
   * Returns a `MEDIUMINT` SQL type.
   *
   * **What is it?**
   * `MEDIUMINT` is a medium integer, with a range of -8,388,608 to 8,388,607 (signed) or 0 to 16,777,215 (unsigned).
   *
   * **Params:**
   * - `unsigned` (boolean): If `true`, creates an unsigned `MEDIUMINT` (default: `false`).
   *
   * @param {boolean} unsigned - Whether the integer is unsigned.
   * @returns {string} - A formatted `MEDIUMINT` SQL type string.
   */
  static MEDIUMINT(unsigned?: boolean): string;
  /**
   * Returns an `INT` or `INTEGER` SQL type.
   *
   * **What is it?**
   * `INT` or `INTEGER` is a standard integer type, with a range of -2,147,483,648 to 2,147,483,647 (signed) or 0 to 4,294,967,295 (unsigned).
   *
   * **Params:**
   * - `unsigned` (boolean): If `true`, creates an unsigned `INT` (default: `false`).
   *
   * @param {boolean} unsigned - Whether the integer is unsigned.
   * @returns {string} - A formatted `INT` SQL type string.
   */
  static INT(unsigned?: boolean): string;
  /**
   * Returns a `BIGINT` SQL type.
   *
   * **What is it?**
   * `BIGINT` is a large integer, with a range of -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 (signed) or 0 to 18,446,744,073,709,551,615 (unsigned).
   *
   * **Params:**
   * - `unsigned` (boolean): If `true`, creates an unsigned `BIGINT` (default: `false`).
   *
   * @param {boolean} unsigned - Whether the integer is unsigned.
   * @returns {string} - A formatted `BIGINT` SQL type string.
   */
  static BIGINT(unsigned?: boolean): string;
  /**
   * Returns a `DECIMAL` or `NUMERIC` SQL type with a specified precision and scale.
   *
   * **What is it?**
   * `DECIMAL` or `NUMERIC` stores fixed-point numbers with exact precision, commonly used for monetary or high-precision data.
   *
   * **Params:**
   * - `precision` (number): The total number of digits (default: 10).
   * - `scale` (number): The number of digits to the right of the decimal point (default: 0).
   *
   * @param {number} precision - Total digits allowed.
   * @param {number} scale - Digits after the decimal point.
   * @returns {string} - A formatted `DECIMAL` SQL type string.
   */
  static DECIMAL(precision?: number, scale?: number): string;
  /**
   * Returns a `FLOAT` SQL type with a specified precision.
   *
   * **What is it?**
   * `FLOAT` stores approximate decimal values for floating-point numbers.
   *
   * **Params:**
   * - `precision` (number): The precision of the floating-point number (optional).
   *
   * @param {number} precision - Precision for the floating-point number.
   * @returns {string} - A formatted `FLOAT` SQL type string.
   */
  static FLOAT(precision?: number): string;
  /**
   * Returns a `DOUBLE` SQL type.
   *
   * **What is it?**
   * `DOUBLE` or `DOUBLE PRECISION` stores larger and more precise floating-point numbers.
   *
   * **Params:**
   * None.
   *
   * @returns {string} - A formatted `DOUBLE` SQL type string.
   */
  static DOUBLE(): string;
  /**
   * Returns a `BIT` SQL type for bit fields.
   *
   * **What is it?**
   * `BIT` is used to store binary values.
   *
   * **Params:**
   * - `size` (number): The number of bits to store (default: 1).
   *
   * @param {number} size - The number of bits to store.
   * @returns {string} - A formatted `BIT` SQL type string.
   */
  static BIT(size?: number): string;
  /**
   * Returns a `BOOLEAN` SQL type.
   *
   * **What is it?**
   * `BOOLEAN` is typically used to store `TRUE` or `FALSE` values. In SQL, it is usually represented as `TINYINT(1)` where 0 is `FALSE` and 1 is `TRUE`.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `BOOLEAN` SQL type.
   */
  static BOOLEAN(): string;
  /**
   * Returns a `BOOL` SQL type, which is an alias for `BOOLEAN`.
   *
   * **What is it?**
   * `BOOL` is just another way to write `BOOLEAN` in SQL. It is used to store `TRUE` or `FALSE` values in a similar way.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `BOOL` SQL type.
   */
  static BOOL(): string;
  /**
   * Returns a `TINYINT` SQL type with a size of 1, used as a boolean representation.
   *
   * **What is it?**
   * `TINYINT(1)` is commonly used for boolean-like values where `0` represents `FALSE` and `1` represents `TRUE`.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `TINYINT(1)` SQL type.
   */
  static TINYINT_BOOL(): string;
  /**
   * Returns a `BIT` SQL type with a size of 1, used for storing a single binary bit (0 or 1).
   *
   * **What is it?**
   * `BIT(1)` is another way to represent boolean values, where `0` is `FALSE` and `1` is `TRUE`.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `BIT(1)` SQL type.
   */
  static BIT_BOOL(): string;
  /**
   * Returns a `DATE` SQL type.
   *
   * **What is it?**
   * The `DATE` type stores dates in the format `YYYY-MM-DD`. It represents only the date without any time component.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `DATE` SQL type.
   */
  static DATE(): string;
  /**
   * Returns a `DATETIME` SQL type.
   *
   * **What is it?**
   * The `DATETIME` type stores both date and time in the format `YYYY-MM-DD HH:MM:SS`. It includes both the date and time.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `DATETIME` SQL type.
   */
  static DATETIME(): string;
  /**
   * Returns a `TIMESTAMP` SQL type.
   *
   * **What is it?**
   * The `TIMESTAMP` type stores date and time in the format `YYYY-MM-DD HH:MM:SS`, similar to `DATETIME`, but with automatic conversion to UTC time.
   * It is often used for tracking record creation and modification times.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `TIMESTAMP` SQL type.
   */
  static TIMESTAMP(): string;
  /**
   * Returns a `TIME` SQL type.
   *
   * **What is it?**
   * The `TIME` type stores time values in the format `HH:MM:SS`. It represents only the time without any date component.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `TIME` SQL type.
   */
  static TIME(): string;
  /**
   * Returns a `YEAR` SQL type.
   *
   * **What is it?**
   * The `YEAR` type stores year values in the format `YYYY`. It represents a single year value.
   *
   * **Params:**
   * - None
   *
   * @returns {string} - The formatted `YEAR` SQL type.
   */
  static YEAR(): string;
}
