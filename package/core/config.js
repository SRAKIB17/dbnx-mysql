export class GlobalConfig {
    static logger_function(log) {
        if (this.logger) {
            this.logger(log);
        }
    }
    static logger = undefined;
}
