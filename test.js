"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
class Model {
    static model;
    static attributes;
    static options;
    static Instance;
    static hooks = {};
    constructor(attributes) {
        Object.assign(this, attributes);
    }
    static init(modelName, attributes, instance, options = {}) {
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
            if (options.primaryKey)
                columnSQL += ' PRIMARY KEY';
            if (options.autoIncrement)
                columnSQL += ' AUTO_INCREMENT';
            if (options.unique)
                columnSQL += ' UNIQUE';
            if (options.defaultValue !== undefined) {
                const defaultValue = options.defaultValue === 'CURRENT_TIMESTAMP'
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
    static async create(values) {
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
    static async findAll(where = {}) {
        const whereClause = this.buildWhereClause(where);
        const query = `SELECT * FROM \`${this.model}\` ${whereClause}`;
        const results = await this.Instance.execute(query);
        return results;
    }
    static async findOne(where) {
        const whereClause = this.buildWhereClause(where);
        const query = `SELECT * FROM \`${this.model}\` ${whereClause} LIMIT 1`;
        const result = await this.Instance.execute(query);
        return result[0]; // Return first result
    }
    static async update(values, where) {
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
    static async destroy(where) {
        await this.runHooks('beforeDestroy', where);
        const whereClause = this.buildWhereClause(where);
        const query = `DELETE FROM \`${this.model}\` ${whereClause}`;
        const result = await this.Instance.execute(query);
        await this.runHooks('afterDestroy', result);
        return result;
    }
    // Helper method to build WHERE clause
    static buildWhereClause(where) {
        if (Object.keys(where).length === 0)
            return '';
        const conditions = Object.entries(where)
            .map(([key, value]) => `\`${key}\` = ?`)
            .join(' AND ');
        return `WHERE ${conditions}`;
    }
    // Hooks management
    static addHook(hookName, fn) {
        if (!this.hooks[hookName]) {
            this.hooks[hookName] = [];
        }
        this.hooks[hookName].push(fn);
    }
    static async runHooks(hookName, ...args) {
        if (this.hooks[hookName]) {
            for (const hook of this.hooks[hookName]) {
                await hook(...args);
            }
        }
    }
    // Relationships
    static hasMany(relatedModel, foreignKey) {
        // Implement relation for `hasMany` (a one-to-many relationship)
        this.addHook('afterCreate', async (instance) => {
            // Example: Create related records in the other model
            await relatedModel.create({ [foreignKey]: instance.id });
        });
    }
    static belongsTo(relatedModel, foreignKey) {
        // Implement relation for `belongsTo` (a many-to-one relationship)
        this.addHook('beforeCreate', async (instance) => {
            const related = await relatedModel.findOne({ id: instance[foreignKey] });
            if (!related) {
                throw new Error(`Related record not found for ${foreignKey}`);
            }
        });
    }
}
exports.Model = Model;
