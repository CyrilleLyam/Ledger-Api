import express, {
  type Request,
  type Response,
  urlencoded,
  json,
} from "express";
import logger from "chhlat-logger";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./constant";
import db from "./db";

const app = express();

app.use(cors());
app.use(helmet());
app.use(json({ limit: "8mb" }));
app.use(urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Ledger API is running" });
});

(async () => {
  await db.raw("SELECT 1");
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
})().catch((err) => {
  logger.error("Failed to connect to database", err);
  process.exit(1);
});
