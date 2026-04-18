import knex from "knex";
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_POOL_MAX } from "./constant";
import { camelToSnake, convertKeysToCamel } from "./utils/case";

const db = knex({
  client: "pg",
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: DB_POOL_MAX,
    acquireTimeoutMillis: 30_000,
    idleTimeoutMillis: 600_000,
  },
  postProcessResponse: (result) => {
    if (Array.isArray(result)) return result.map((row) => convertKeysToCamel(row));
    if (result && typeof result === "object") return convertKeysToCamel(result as Record<string, unknown>);
    return result;
  },
  wrapIdentifier: (value, origImpl) => origImpl(camelToSnake(value)),
});

export default db;
