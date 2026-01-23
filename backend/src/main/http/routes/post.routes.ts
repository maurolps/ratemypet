import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";
import { makeCreatePostController } from "@main/composition/posts/create-post.controller.factory";

export const postRoutes = Router();

const createPostRateLimit = makeRateLimiter({ limit: 5 });

postRoutes.post(
  "/posts",
  authMiddleware(),
  createPostRateLimit,
  expressAdapter(makeCreatePostController()),
);
