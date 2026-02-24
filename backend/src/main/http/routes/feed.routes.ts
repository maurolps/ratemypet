import { Router } from "express";
import { makeGetFeedController } from "@main/composition/feed/get-feed.controller.factory";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { optionalAuthMiddleware } from "../middlewares/authenticate";

export const feedRoutes = Router();

const getFeedRateLimit = makeRateLimiter({ limit: 30 });

feedRoutes.get(
  "/feed",
  optionalAuthMiddleware(),
  getFeedRateLimit,
  expressAdapter(makeGetFeedController()),
);
