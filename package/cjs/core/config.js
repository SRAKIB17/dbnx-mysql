"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfig = void 0;
class GlobalConfig {
  static logger_function(log) {
    if (this.logger) {
      this.logger(log);
    }
  }
  static logger = undefined;
}
exports.GlobalConfig = GlobalConfig;
