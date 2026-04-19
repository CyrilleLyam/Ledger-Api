import "reflect-metadata";
import express from "express";
import { useExpressServer } from "routing-controllers";
import swaggerUi from "swagger-ui-express";
import logger from "chhlat-logger";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./constant";
import db from "./db";
import { BudgetsController } from "./controllers/budgets.controller";
import { TransactionsController } from "./controllers/transactions.controller";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { SnakeCaseInterceptor } from "./interceptors/snake-case.interceptor";
import { buildSwaggerSpec } from "./swagger";

const app = express();

app.use(cors());
app.use(helmet());

useExpressServer(app, {
  controllers: [BudgetsController, TransactionsController],
  middlewares: [ErrorMiddleware],
  interceptors: [SnakeCaseInterceptor],
  defaultErrorHandler: false,
});

const swaggerSpec = buildSwaggerSpec();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.json({ message: "Ledger API is running" });
});

(async () => {
  await db.raw("SELECT 1");
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Swagger docs at http://localhost:${PORT}/api-docs`);
  });
})().catch((err) => {
  logger.error("Failed to connect to database", err);
  process.exit(1);
});
