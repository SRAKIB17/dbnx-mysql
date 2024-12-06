export class DATE_TIME {
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
    static DATE(): string {
        return 'DATE';
    }

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
    static DATETIME(): string {
        return 'DATETIME';
    }

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
    static TIMESTAMP(): string {
        return 'TIMESTAMP';
    }

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
    static TIME(): string {
        return 'TIME';
    }

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
    static YEAR(): string {
        return 'YEAR';
    }

}
