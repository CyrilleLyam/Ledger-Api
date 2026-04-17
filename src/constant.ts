import dotenv from "dotenv";

dotenv.config();

const raiseError = (msg: string) => {
  throw new Error(msg);
};

export const PORT =
  process.env.PORT ?? raiseError("PORT environment variable is required");

export const DB_HOST =
  process.env.DB_HOST ?? raiseError("DB_HOST environment variable is required");
export const DB_PORT = Number(
  process.env.DB_PORT ?? raiseError("DB_PORT environment variable is required"),
);
export const DB_NAME =
  process.env.DB_NAME ?? raiseError("DB_NAME environment variable is required");
export const DB_USER =
  process.env.DB_USER ?? raiseError("DB_USER environment variable is required");
export const DB_PASSWORD =
  process.env.DB_PASSWORD ??
  raiseError("DB_PASSWORD environment variable is required");

export const DB_POOL_MAX = Number(process.env.DB_POOL_MAX ?? 10);
