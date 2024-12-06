import { DBnx } from "./handler";
import { Attributes, ModelDefine, TableOptions } from "./model-define";
import { destroy, findingQuery, insertInto, update } from "./query";
import { CreateOptionsType, CreateParamsType, DeleteParamsType, FindAllParamsType, FindOneParamsType, ResponseType, UpdateParamsType } from "./types";

type Hooks = Record<string, Function[]>;

type ColumnMetadata = {
    field: string;
    type: string;
    null: "YES" | "NO";
    constraintName: string,
    key: "PRI" | "MUL" | "UNI" | "NULL",
    default: string | null;
    extra: string;
}

interface TableMetadata {
    [columnName: string]: ColumnMetadata;
}

export class Model extends ModelDefine {
    static hooks: Hooks = {};

    constructor(attributes: any) {
        super()
        Object.assign(this, attributes);
    }
    // Hooks management
    static addHook(hookName: string, fn: Function) {
        if (!this.hooks[hookName]) {
            this.hooks[hookName] = [];
        }
        this.hooks[hookName].push(fn);
    }

    static async runHooks(hookName: string, ...args: any[]) {
        if (this.hooks[hookName]) {
            for (const hook of this.hooks[hookName]) {
                await hook(...args);
            }
        }
    }

    /**
      * Initializes a model with schema and database information.
      * @param model - Model name in the format `db_name.table_name` or just `table_name`.
      * @param attributes - Schema definition of the model.
      * @param instance - Instance of the database handler (`DBnx`).
      * @param options - Additional table options such as engine, collation, etc.
      * @returns The current `Model` instance.
      */

    static init(model: string, attributes: Attributes, instance: DBnx, options: TableOptions = {}) {
        if (!instance) {
            throw new Error("🌋No instance passed Or instance not match");
        }
        if (!model) {
            throw new Error("Please define model name");
        }
        this.modelAttributes = attributes;
        const parts = model?.split('.');
        this.database = parts?.length > 1 ? parts[0] : instance.getConfig()?.database; // Extract database name if provided
        this.tableName = parts?.[parts.length - 1];                  // Extract the model name
        this.tableOptions = options;
        this.dbInstance = instance;
        this.dbTableIdentifier = `${this.database ? `${this.database}.` : ""}${this.tableName}`
        this.generateDDL(attributes);
        return this
    }

    /**
   * Creates a new record in the database.
   * @param values - Data to insert into the table.
   * @param options - Optional settings for the insertion.
   * @returns The result of the operation as a `ResponseType`.
   */
    static async create(values: CreateParamsType<[]>, options?: CreateOptionsType): Promise<ResponseType>;
    // Implementation of the overloaded static method
    static async create(...args: any[]): Promise<ResponseType> {
        // Check if the first argument is a string (table name)

        let values = args[0];
        let options = args[1] || {};
        // await this.runHooks('beforeCreate', values);
        // Ensure the values is an object and not empty
        if (!values || typeof values !== 'object' || Object.keys(values).length === 0) {
            throw new Error("Values must be a non-empty object.");
        }
        const result = await this.dbInstance.execute(insertInto(this.dbTableIdentifier, values, options));
        return result;
    }

    /**
     * Retrieves all records that match the provided configuration.
     * @param Config - Configuration for the query (e.g., filters, joins).
     * @returns The query result as a `ResponseType`.
     */
    static async findAll<Tables extends string[]>(Config?: FindAllParamsType<Tables>): Promise<ResponseType> {

        if (Config && typeof Config !== 'object') {
            throw new Error("Config must be a non-empty object.");
        }
        const result = await this.dbInstance.execute(findingQuery(this.dbTableIdentifier, Config));
        return result;
    }

    /**
    * Retrieves the first record that matches the provided configuration.
    * @param Config - Configuration for the query (e.g., filters, joins).
    * @returns The first matching record as a `ResponseType`.
    */
    static async findOne<Tables extends string[]>(Config?: FindOneParamsType<Tables>): Promise<ResponseType> {
        if (Config && typeof Config !== 'object') {
            throw new Error("Config must be a non-empty object.");
        }

        let config: Record<string, any> = Config ?? {};
        config.limitSkip = { limit: 1 };
        const result = await this.dbInstance.execute(findingQuery(this.dbTableIdentifier, config));
        return result;
    }

    /**
     * Updates records in the table based on the provided criteria.
     * @param Props - Update criteria and data.
     * @returns The result of the update as a `ResponseType`.
     */
    static async update<Tables extends string[]>(Props: UpdateParamsType<Tables>): Promise<ResponseType> {
        if (typeof Props !== 'object') {
            throw new Error("Props must be a non-empty object.");
        }
        const result = await this.dbInstance.execute(update(this.dbTableIdentifier, Props));
        return result;
    }

    /**
    * Deletes records from the table based on the provided criteria.
    * @param Props - Criteria for deletion.
    * @returns The result of the deletion as a `ResponseType`.
    */
    static async delete<Tables extends string[]>(Props: DeleteParamsType<Tables>): Promise<ResponseType> {
        if (typeof Props !== 'object') {
            throw new Error("Props must be a non-empty object.");
        }
        const result = await this.dbInstance.execute(destroy(this.dbTableIdentifier, Props));
        return result;
    }

    protected static async getColumnMetadata(): Promise<ColumnMetadata[]> {

        const db = await this.dbInstance.execute(`
SELECT 
    c.COLUMN_NAME AS \`field\`,
    c.COLUMN_TYPE AS \`type\`,
    c.IS_NULLABLE AS \`null\`,
    c.COLUMN_KEY AS \`key\`,
    c.COLUMN_DEFAULT AS \`default\`,
    c.EXTRA AS \`extra\`,
    kcu.CONSTRAINT_NAME as constraintName
FROM
    INFORMATION_SCHEMA.COLUMNS c
        LEFT JOIN
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON c.COLUMN_NAME = kcu.COLUMN_NAME
        AND c.TABLE_NAME = kcu.TABLE_NAME
        AND c.TABLE_SCHEMA = kcu.TABLE_SCHEMA
WHERE
    c.TABLE_NAME = '${this.tableName}'
    AND c.TABLE_SCHEMA = '${this.database}'
       `);

        return db?.result;
    }

    protected static async listConstraints(): Promise<{
        constraintName: string,
        constraintType: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK' | 'DEFAULT' | 'NOT NULL';
    }[]> {
        const query = `
SELECT
    CONSTRAINT_NAME AS constraintName,
    CONSTRAINT_TYPE AS constraintType
FROM
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE
    TABLE_NAME = '${this.tableName}'
        AND TABLE_SCHEMA = '${this.database}'
          `;
        return (await this.dbInstance.execute(query))?.result;
    }
    protected static async dropTableConstraints() {
        const constraintList = await this.listConstraints();

        if (!constraintList?.length) {
            return;
        }

        const constraintsQuery = new Set();
        const columnMetadata = await this.getColumnMetadata();

        // Modify columns with primary keys
        columnMetadata
            ?.filter((r) => r?.key === 'PRI')
            ?.forEach((r) => {
                const defaultValue = r?.default ? ` DEFAULT ${r?.default}` : r?.null === 'YES' ? ' DEFAULT NULL' : '';
                constraintsQuery.add(`MODIFY COLUMN ${r?.field} ${r?.type}${defaultValue}`);
            });


        if (constraintList?.length) {
            console.log('\x1b[36m%s\x1b[0m', 'Constraints to drop:', this.dbTableIdentifier); // Light Cyan for info
            console.table(constraintList);
        }

        for (const constraint of constraintList) {
            const { constraintName, constraintType } = constraint;

            switch (constraintType) {
                case 'PRIMARY KEY':
                    constraintsQuery.add(`DROP PRIMARY KEY`);
                    break;
                case 'FOREIGN KEY':
                    constraintsQuery.add(`DROP FOREIGN KEY ${constraintName}`);
                    break;
                case 'UNIQUE':
                    constraintsQuery.add(`DROP INDEX ${constraintName}`);
                    break;
                case 'CHECK':
                    console.warn('\x1b[33m%s\x1b[0m', `CHECK constraints cannot be dropped directly. Consider alternative handling.`);
                    break;
                case 'DEFAULT':
                case 'NOT NULL':
                    console.log(`Attempting to drop ${constraintType} on ${constraintName}`);
                    // Adjust the column instead of dropping the constraint directly
                    const column = columnMetadata.find((col) => col.field === constraintName);
                    if (column) {
                        const definition = `${column.type}${column.null === 'YES' ? ' NULL' : ' NOT NULL'}`;
                        constraintsQuery.add(`MODIFY COLUMN ${column.field} ${definition}`);
                    }
                    break;
                default:
                    throw new Error(`Unknown constraint type: ${constraintType}`);
            }
        }
        if (constraintsQuery.size) {
            const query = `ALTER TABLE ${this.dbTableIdentifier}\n${[...constraintsQuery].join(',\n')}`;
            console.log('\x1b[36m%s\x1b[0m', `Executing Query:\n${query}`);
            const result = await this.dbInstance.execute(query);
            if (!result?.success) this.errorHandle(result);
        }
    }
    // Drop a model if it exists
    static async drop() {
        await this.dropTableConstraints();
        const query = `DROP TABLE IF EXISTS ${this.dbTableIdentifier}`;
        return this.errorHandle(await this.dbInstance.execute(query));
    }
    static async sync(force = false) {
        await this.dropTableConstraints();

        if (force) {
            // Drop the table if `force` is true
            await this.drop();
            return this.errorHandle(await this.dbInstance.execute(this.ddlQuery));
        }

        const columnData = (await this.getColumnMetadata() as any[])?.reduce((acc, curr) => {
            acc[curr?.field] = curr; // Add the current metadata to the accumulator
            return acc; // Return updated accumulator
        }, {}) as TableMetadata;

        if (typeof columnData !== 'object' || Object.keys(columnData)?.length === 0) {
            // Table does not exist or is empty; recreate the table
            await this.drop();
            return this.errorHandle(await this.dbInstance.execute(this.ddlQuery));
        }

        let query = `ALTER TABLE ${this.dbTableIdentifier}\n${this.getEngineOptions()}`;

        let modifyColumn = [];

        for (const key in this.modelAttributes) {
            if (!this.modelAttributes.hasOwnProperty(key)) continue;
            const value = this.modelAttributes[key];

            // if (value?.primaryKey && (key in columnData) && columnData[key]?.key) continue;

            if (value?.modifyColumn && (value?.modifyColumn in columnData)) {
                modifyColumn.push(value?.modifyColumn)
                query += `,\n CHANGE COLUMN \`${value?.modifyColumn}\` ${this.generateColumnsSQL(
                    { [key]: value }, true)
                    }`;
            }
            else if (key in columnData) {
                query += `,\n MODIFY COLUMN ${this.generateColumnsSQL(
                    { [key]: value }, true
                )}`;
                // console.log(value)
            }
            else {
                query += `,\n ADD COLUMN ${this.generateColumnsSQL(
                    { [key]: value }, true
                )}`;
            }
        }

        for (const existingKey in columnData) {

            if (!(existingKey in this.modelAttributes) && !modifyColumn?.includes(existingKey)) {
                query += `,\n DROP COLUMN \`${existingKey}\``;
            }
        }
        return this.errorHandle(await this.dbInstance.execute(query));
    }
    private static errorHandle(data: ResponseType) {
        if (!data?.success) {
            throw Error(data.error);
            // throw Error(data.error, {
            //     message: data,
            // });
        }
        return data;
    }
}

