import { MySQLHandler } from './MySQLHandler';

export type ColumnOptions = {
    type: string;
    allowNull?: boolean;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    unique?: boolean;
    defaultValue?: any;
    references?: { model: string; key: string };
};

export type TableOptions = {
    engine?: string;
    charset?: string;
    collation?: string;
    autoIncrement?: number;
};

type Attributes = Record<string, ColumnOptions>;
type Hooks = Record<string, Function[]>;

export class Model {
    static model: string;
    static attributes: Attributes;
    static options: TableOptions;
    static Instance: MySQLHandler;
    static hooks: Hooks = {};

    constructor(attributes: any) {
        Object.assign(this, attributes);
    }

    static init(
        modelName: string,
        attributes: Attributes,
        instance: MySQLHandler,
        options: TableOptions = {}
    ) {
        this.model = modelName;
        this.attributes = attributes;
        this.options = options;
        this.Instance = instance;
        this.define();
    }

    static define() {
        let schema = '';
        Object.entries(this.attributes).forEach(([name, options]) => {
            let columnSQL = `\`${name}\` ${options.type}`;

            if (options.allowNull === false) {
                columnSQL += ' NOT NULL';
            }

            if (options.primaryKey) columnSQL += ' PRIMARY KEY';
            if (options.autoIncrement) columnSQL += ' AUTO_INCREMENT';
            if (options.unique) columnSQL += ' UNIQUE';

            if (options.defaultValue !== undefined) {
                const defaultValue =
                    options.defaultValue === 'CURRENT_TIMESTAMP'
                        ? 'CURRENT_TIMESTAMP'
                        : `'${options.defaultValue}'`;
                columnSQL += ` DEFAULT ${defaultValue}`;
            }

            if (options.references) {
                const { model, key } = options.references;
                columnSQL += ` REFERENCES \`${model}\` (\`${key}\`)`;
            }

            schema += `${schema ? ', ' : ''}${columnSQL}`;
        });

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`${this.model}\` (
                ${schema}
            ) ENGINE=${this.options.engine || 'InnoDB'}
            DEFAULT CHARSET=${this.options.charset || 'utf8mb4'}
            COLLATE=${this.options.collation || 'utf8mb4_unicode_ci'};
        `;

        this.Instance.execute(createTableQuery);
    }

    // CRUD Operations
    static async create(values: any) {
        await this.runHooks('beforeCreate', values);

        const columns = Object.keys(this.attributes).join(', ');
        const placeholders = Object.keys(this.attributes)
            .map(() => '?')
            .join(', ');
        const valuesArray = Object.values(values);

        const query = `INSERT INTO \`${this.model}\` (${columns}) VALUES (${placeholders})`;

        const result = await this.Instance.execute(query, valuesArray);

        await this.runHooks('afterCreate', result);
        return result;
    }

    static async findAll(where: object = {}) {
        const whereClause = this.buildWhereClause(where);
        const query = `SELECT * FROM \`${this.model}\` ${whereClause}`;
        const results = await this.Instance.execute(query);
        return results;
    }

    static async findOne(where: object) {
        const whereClause = this.buildWhereClause(where);
        const query = `SELECT * FROM \`${this.model}\` ${whereClause} LIMIT 1`;
        const result = await this.Instance.execute(query);
        return result[0]; // Return first result
    }

    static async update(values: any, where: object) {
        await this.runHooks('beforeUpdate', values);

        const setClause = Object.entries(values)
            .map(([key, value]) => `\`${key}\` = ?`)
            .join(', ');
        const whereClause = this.buildWhereClause(where);

        const query = `UPDATE \`${this.model}\` SET ${setClause} ${whereClause}`;
        const result = await this.Instance.execute(query, Object.values(values));

        await this.runHooks('afterUpdate', result);
        return result;
    }

    static async destroy(where: object) {
        await this.runHooks('beforeDestroy', where);

        const whereClause = this.buildWhereClause(where);
        const query = `DELETE FROM \`${this.model}\` ${whereClause}`;
        const result = await this.Instance.execute(query);

        await this.runHooks('afterDestroy', result);
        return result;
    }

    // Helper method to build WHERE clause
    static buildWhereClause(where: object) {
        if (Object.keys(where).length === 0) return '';
        const conditions = Object.entries(where)
            .map(([key, value]) => `\`${key}\` = ?`)
            .join(' AND ');
        return `WHERE ${conditions}`;
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

    // Relationships
    static hasMany(relatedModel: any, foreignKey: string) {
        // Implement relation for `hasMany` (a one-to-many relationship)
        this.addHook('afterCreate', async (instance: any) => {
            // Example: Create related records in the other model
            await relatedModel.create({ [foreignKey]: instance.id });
        });
    }

    static belongsTo(relatedModel: any, foreignKey: string) {
        // Implement relation for `belongsTo` (a many-to-one relationship)
        this.addHook('beforeCreate', async (instance: any) => {
            const related = await relatedModel.findOne({ id: instance[foreignKey] });
            if (!related) {
                throw new Error(`Related record not found for ${foreignKey}`);
            }
        });
    }
}
