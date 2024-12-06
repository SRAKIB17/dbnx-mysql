export class BOOLEAN {
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
}
