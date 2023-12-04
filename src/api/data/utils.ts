/** 
This file serves as the base for all CRUD operations.
*/

import Database from "better-sqlite3";

type StringKeyMap = { [key: string]: any };
type StringMap = { [key: string]: string };

function prepareValuesToJSON(
  objs: (number | string | Array<number> | StringKeyMap)[]
): any[] {
  let values: any[] = [];
  for (let obj of objs) {
    if (typeof obj == "number" || typeof obj == "string") {
      values.push(obj);
    } else {
      values.push(JSON.stringify(obj));
    }
  }
  return values;
}

function prepareInsertStatement(
  row: StringKeyMap,
  table: string
): [string, any[]] {
  const keys = Object.keys(row);
  const values = Object.values(row);
  const placeholders = keys.map(() => "?");
  const stmt = `INSERT INTO ${table} (${keys.join(
    ", "
  )}) VALUES (${placeholders.join(", ")})`;
  return [stmt, prepareValuesToJSON(values)];
}

export function addRow(row: StringKeyMap, table: string): Database.RunResult {
  const db = new Database("app.db");
  const [stmt, values] = prepareInsertStatement(row, table);
  const st = db.prepare(stmt);
  const result = st.run(values);
  db.close();
  return result;
}

export function updateValue(
  col: string,
  value: any,
  where: StringKeyMap,
  table: string
): void {
  const db = new Database("app.db");
  const keys = Object.keys(where);
  const values = Object.values(where);
  const placeholders = keys.map((key) => `${key} = ?`);
  const stmt = `UPDATE ${table} SET ${col} = ? WHERE ${placeholders.join(
    " AND "
  )}`;
  const st = db.prepare(stmt);
  const result = st.run(prepareValuesToJSON([value, ...values]));
  db.close();
}

export function deleteRows(where: StringKeyMap, table: string): void {
  const db = new Database("app.db");
  const keys = Object.keys(where);
  const values = Object.values(where);
  const placeholders = keys.map((key) => `${key} = ?`);
  const stmt = `DELETE FROM ${table} WHERE ${placeholders.join(" AND ")}`;
  const st = db.prepare(stmt);
  const result = st.run(prepareValuesToJSON(values));
  db.close();
}

/**
 * Query the database.
 * @param cols columns to query. '*' means all columns.
 * @param where the where clause ('=' only). When empty, all rows are returned.
 * @param table table to query
 * @returns a list of JSON objects
 */
export function query(cols: string[], where: StringKeyMap, table: string): any {
  const db = new Database("app.db");
  const keys = Object.keys(where);
  const values = Object.values(where);
  const placeholders = keys.map((key) => `${key} = ?`);
  const condition =
    keys.length > 0 ? `WHERE ${placeholders.join(" AND ")}` : "";
  const stmt = `SELECT ${cols.join(", ")} FROM ${table} ${condition}`;
  const st = db.prepare(stmt);
  const result = st.all(prepareValuesToJSON(values));
  db.close();
  return result;
}
