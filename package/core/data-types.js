export class DataTypes {
  static STRING(size = 250) {
    return `VARCHAR(${size})`;
  }
  static CHAR(size = 35) {
    return `CHAR(${size})`;
  }
  static TEXT(type = "TEXT") {
    return `${type}`;
  }
  static BLOB(type = "BLOB") {
    return type;
  }
  static JSON() {
    return "JSON";
  }
  static BINARY(size = 16) {
    return `BINARY(${size})`;
  }
  static VARBINARY(size = 255) {
    return `VARBINARY(${size})`;
  }
  static ENUM() {
    return `ENUM`;
  }
  static TINYINT(unsigned = false) {
    return `TINYINT${unsigned ? " UNSIGNED" : ""}`;
  }
  static SMALLINT(unsigned = false) {
    return `SMALLINT${unsigned ? " UNSIGNED" : ""}`;
  }
  static MEDIUMINT(unsigned = false) {
    return `MEDIUMINT${unsigned ? " UNSIGNED" : ""}`;
  }
  static INT(unsigned = false) {
    return `INT${unsigned ? " UNSIGNED" : ""}`;
  }
  static BIGINT(unsigned = false) {
    return `BIGINT${unsigned ? " UNSIGNED" : ""}`;
  }
  static DECIMAL(precision = 10, scale = 0) {
    return `DECIMAL(${precision}, ${scale})`;
  }
  static FLOAT(precision) {
    return precision ? `FLOAT(${precision})` : "FLOAT";
  }
  static DOUBLE() {
    return `DOUBLE`;
  }
  static BIT(size = 1) {
    return `BIT(${size})`;
  }
  static BOOLEAN() {
    return "BOOLEAN";
  }
  static BOOL() {
    return "BOOL";
  }
  static TINYINT_BOOL() {
    return "TINYINT(1)";
  }
  static BIT_BOOL() {
    return "BIT(1)";
  }
  static DATE() {
    return "DATE";
  }
  static DATETIME() {
    return "DATETIME";
  }
  static TIMESTAMP() {
    return "TIMESTAMP";
  }
  static TIME() {
    return "TIME";
  }
  static YEAR() {
    return "YEAR";
  }
}
