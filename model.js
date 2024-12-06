"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const handler_1 = require("./handler");
const model_sync_1 = require("./model-sync");
const query_1 = require("./query");
class Model extends model_sync_1.ModelSync {
    static hooks = {};
    constructor(attributes) {
        super();
        Object.assign(this, attributes);
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
    static init(model, attributes, instance, options = {}) {
        if (!instance || !(instance instanceof handler_1.DBnx)) {
            throw new Error("🌋No instance passed Or instance not match");
        }
        if (!model) {
            throw new Error("Please define model name");
        }
        this.attributes = attributes;
        this.model = model;
        this.options = options;
        this.Instance = instance;
        this.define();
        return this;
    }
    // Implementation of the overloaded static method
    static async create(...args) {
        // Check if the first argument is a string (table name)
        let table = this.model;
        let values = args[0];
        let options = args[1] || {};
        // await this.runHooks('beforeCreate', values);
        // Ensure the values is an object and not empty
        if (!values || typeof values !== 'object' || Object.keys(values).length === 0) {
            throw new Error("Values must be a non-empty object.");
        }
        const result = await this.Instance.execute((0, query_1.insertInto)(table, values, options));
        // // await this.runHooks('beforeCreate', () => { console.log(43534) });
        return result;
    }
    static async findAll(Config) {
        let table = this.model;
        if (typeof Config !== 'object') {
            throw new Error("Config must be a non-empty object.");
        }
        const result = await this.Instance.execute((0, query_1.findingQuery)(table, Config));
        return result;
    }
    static async findOne(Config) {
        let table = this.model;
        if (typeof Config !== 'object') {
            throw new Error("Config must be a non-empty object.");
        }
        const result = await this.Instance.execute((0, query_1.findingQuery)(table, Config));
        return result;
    }
    static async update(Props) {
        if (typeof Props !== 'object') {
            throw new Error("Props must be a non-empty object.");
        }
        const result = await this.Instance.execute((0, query_1.update)(this.model, Props));
        return result;
    }
    static async delete(Props) {
        if (typeof Props !== 'object') {
            throw new Error("Props must be a non-empty object.");
        }
        const result = await this.Instance.execute((0, query_1.destroy)(this.model, Props));
        return result;
    }
}
exports.Model = Model;
// export class GeneratedModel {
//     static define<TAttributes>(
//         modelName: string,
//         attributes: Record<string, ColumnOptions>,
//         options?: TableOptions,
//     ) {
//         class Generated extends Model {
//             constructor() {
//                 super(modelName, attributes, options);
//             }
//         }
//         Object.defineProperty(Generated, 'name', { value: modelName });
//         return this;
//     }
// }
