import { AppError } from "@application/errors/app-error";
import { env } from "@main/config/env";
import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

type RateLimitOptions = Parameters<typeof rateLimit>[0];

const enabled = env.RATE_LIMIT_ENABLED === "true";

export function makeRateLimiter(options: RateLimitOptions) {
  return enabled
    ? rateLimit({
        ...options,
        standardHeaders: true,
        legacyHeaders: false,
        windowMs: 60_000,
        handler: (_req, _res, next) =>
          next(
            new AppError(
              "RATE_LIMIT_EXCEEDED",
              "Limit exceeded. Please try again later.",
            ),
          ),
      })
    : (_req: Request, _res: Response, next: NextFunction) => next();
}
