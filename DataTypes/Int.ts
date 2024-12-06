export class INT {
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
    static TINYINT(unsigned: boolean = false): string {
        return `TINYINT${unsigned ? ' UNSIGNED' : ''}`;
    }

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
    static SMALLINT(unsigned: boolean = false): string {
        return `SMALLINT${unsigned ? ' UNSIGNED' : ''}`;
    }

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
    static MEDIUMINT(unsigned: boolean = false): string {
        return `MEDIUMINT${unsigned ? ' UNSIGNED' : ''}`;
    }

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
    static INT(unsigned: boolean = false): string {
        return `INT${unsigned ? ' UNSIGNED' : ''}`;
    }

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
    static BIGINT(unsigned: boolean = false): string {
        return `BIGINT${unsigned ? ' UNSIGNED' : ''}`;
    }

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
    static DECIMAL(precision: number = 10, scale: number = 0): string {
        return `DECIMAL(${precision}, ${scale})`;
    }

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
    static FLOAT(precision?: number): string {
        return precision ? `FLOAT(${precision})` : 'FLOAT';
    }

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
    static DOUBLE(): string {
        return `DOUBLE`;
    }

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
    static BIT(size: number = 1): string {
        return `BIT(${size})`;
    }
}
