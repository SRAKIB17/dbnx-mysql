
export class STRING {

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
    static STRING(size: string | number = 250): string {
        return `VARCHAR(${size})`;
    }

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
    static CHAR(size: number = 35): string {
        return `CHAR(${size})`;
    }

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
    static TEXT(type: 'TINYTEXT' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT' = 'TEXT'): string {
        return `${type}`;
    }

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
    static BLOB(type: "TINYBLOB" | "BLOB" | "MEDIUMBLOB" | "LONGBLOB" = "BLOB"): string {
        return type;
    }

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
    static JSON(): string {
        return "JSON";
    }

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
    static BINARY(size: number = 16): string {
        return `BINARY(${size})`;
    }

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
    static VARBINARY(size: number = 255): string {
        return `VARBINARY(${size})`;
    }

    /**
     * Returns a `ENUM` SQL type.
     * 
     * **What is it?**  
     * A string object that can have only one value, chosen from a list of possible values. You can list up to 65535 values in an ENUM list. If a value is inserted that is not in the list, a blank value will be inserted. The values are sorted in the order you enter them
     * 
     * @returns {string} - A formatted `ENUM` SQL type string.
     */
    static ENUM(): string {
        return `ENUM`;
    }
}
