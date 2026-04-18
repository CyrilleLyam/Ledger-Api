import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from "routing-controllers";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import logger from "chhlat-logger";

@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else if (error instanceof HttpError) {
      res.status(error.httpCode).json({ message: error.message, errors: (error as unknown as Record<string, unknown>).errors });
    } else {
      logger.error(error instanceof Error ? error.message : String(error));
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
