import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";
import { makeCreatePostController } from "@main/composition/posts/create-post.controller.factory";
import { makeLikePostController } from "@main/composition/posts/like-post.controller.factory";

export const postRoutes = Router();

const createPostRateLimit = makeRateLimiter({ limit: 5 });
const likePostRateLimit = makeRateLimiter({ limit: 10 });

postRoutes.post(
  "/posts",
  authMiddleware(),
  createPostRateLimit,
  expressAdapter(makeCreatePostController()),
);

postRoutes.post(
  "/posts/:id/likes",
  authMiddleware(),
  likePostRateLimit,
  (request, _response, next) => {
    request.body = {
      ...request.body,
      post_id: request.params.id,
    };
    next();
  },
  expressAdapter(makeLikePostController()),
);
