"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbnxCondition = dbnxCondition;
const sanitize_js_1 = require("./sanitize.js");
function handlePattern(value, operator) {
  const escapeRegexp = (str) => {
    return `'${str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}'`;
  };
  switch (operator) {
    case "REGEXP":
      return escapeRegexp(value.replace(/%/g, ".*").replace(/_/g, "."));
    case "NOT LIKE":
    case "LIKE":
      return `'${value.replace(/[\0\x08\x09\x1a\n\r"'\\]/g, (char) => {
        switch (char) {
          case "\0":
            return "\\0";
          case "\x08":
            return "\\b";
          case "\x09":
            return "\\t";
          case "\x1a":
            return "\\z";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case '"':
            return '\\"';
          case "'":
            return "\\'";
          case "\\":
            return "\\\\";
          default:
            return char;
        }
      })}'`;
    default:
      return (0, sanitize_js_1.sanitize)(value);
  }
}
function dbnxCondition(filters, joinBy = "AND") {
  let conditions = [];
  for (let column in filters) {
    const value = filters[column];
    if (column == "$and") {
      conditions.push(`(${dbnxCondition(value, "AND")})`);
    } else if (column == "$or") {
      conditions.push(`(${dbnxCondition(value, "OR")})`);
    } else if (typeof value == "object") {
      let [t, col] = column?.split(".");
      if (col) {
        col = `${t}.\`${col}\``;
      } else {
        col = `\`${column}\``;
      }
      if (Array.isArray(value)) {
        conditions.push(`${col} IN ${(0, sanitize_js_1.sanitize)(value)}`);
      } else {
        if (Array.isArray(value?.notIn) && value?.notIn?.length) {
          conditions.push(
            `${col} NOT IN ${(0, sanitize_js_1.sanitize)(value?.notIn)}`,
          );
        }
        if (Array.isArray(value?.in) && value?.in?.length) {
          conditions.push(
            `${col} IN ${(0, sanitize_js_1.sanitize)(value?.in)}`,
          );
        }
        if (Array.isArray(value?.between) && value?.between?.length == 2) {
          conditions.push(
            `${col} BETWEEN ${(0, sanitize_js_1.sanitize)(value?.between?.[0])} AND ${(0, sanitize_js_1.sanitize)(value?.between?.[1])}`,
          );
        }
        if (
          Array.isArray(value?.notBetween) &&
          value?.notBetween?.length == 2
        ) {
          conditions.push(
            `${col} NOT BETWEEN ${(0, sanitize_js_1.sanitize)(value?.notBetween?.[0])} AND ${(0, sanitize_js_1.sanitize)(value?.notBetween?.[1])}`,
          );
        }
        if (Array.isArray(value?.inRange) && value?.inRange?.length == 2) {
          conditions.push(
            `${col} BETWEEN ${(0, sanitize_js_1.sanitize)(value?.inRange?.[0])} AND ${(0, sanitize_js_1.sanitize)(value?.inRange?.[1])}`,
          );
        }
        if (Array.isArray(value?.$or) && value?.$or?.length) {
          const orConditions = value.$or.map((subFilter) =>
            dbnxCondition({ [column]: subFilter }, "OR"),
          );
          conditions.push(`(${orConditions.join(" OR ")})`);
        }
        if (Array.isArray(value?.$and) && value?.$and?.length) {
          const orConditions = value.$and.map((subFilter) =>
            dbnxCondition({ [column]: subFilter }, "AND"),
          );
          conditions.push(`(${orConditions.join(" AND ")})`);
        }
        if (value.like && typeof value?.like == "string") {
          conditions.push(`${col} LIKE ${handlePattern(value.like, "LIKE")}`);
        }
        if (value.notLike && typeof value?.notLike == "string") {
          conditions.push(
            `${col} NOT LIKE ${handlePattern(value.notLike, "NOT LIKE")}`,
          );
        }
        if (value.regexp && typeof value?.regexp == "string") {
          conditions.push(
            `${col} REGEXP ${handlePattern(value.regexp, "REGEXP")}`,
          );
        }
        if (value.eq) {
          conditions.push(`${col} = ${(0, sanitize_js_1.sanitize)(value?.eq)}`);
        }
        if (value.gt) {
          conditions.push(`${col} > ${(0, sanitize_js_1.sanitize)(value?.gt)}`);
        }
        if (value.lt) {
          conditions.push(`${col} < ${(0, sanitize_js_1.sanitize)(value?.lt)}`);
        }
        if (value.gte) {
          conditions.push(
            `${col} >= ${(0, sanitize_js_1.sanitize)(value?.gte)}`,
          );
        }
        if (value.lte) {
          conditions.push(
            `${col} <= ${(0, sanitize_js_1.sanitize)(value?.lte)}`,
          );
        }
        if (value.neq) {
          conditions.push(
            `${col} != ${(0, sanitize_js_1.sanitize)(value?.neq)}`,
          );
        }
        if (value?.isNull != undefined) {
          if (value.isNull) {
            conditions.push(`${col} IS NULL`);
          } else {
            conditions.push(`${col} IS NOT NULL`);
          }
        }
      }
    } else if (typeof value === "string" || typeof value === "number") {
      let [t, col] = column?.split(".");
      if (col) {
        column = `${t}.\`${col}\``;
      } else {
        column = `\`${column}\``;
      }
      conditions.push(`${column} = ${(0, sanitize_js_1.sanitize)(value)}`);
    }
  }
  return conditions?.length ? conditions?.join(` ${joinBy || "AND"} `) : "";
}
