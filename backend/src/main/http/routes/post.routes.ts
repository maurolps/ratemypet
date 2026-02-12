import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";
import { makeCreatePostController } from "@main/composition/posts/create-post.controller.factory";
import { makeCreateCommentController } from "@main/composition/posts/create-comment.controller.factory";
import { makeLikePostController } from "@main/composition/posts/like-post.controller.factory";
import { makeUnlikePostController } from "@main/composition/posts/unlike-post.controller.factory";

export const postRoutes = Router();

const createPostRateLimit = makeRateLimiter({ limit: 5 });
const createCommentRateLimit = makeRateLimiter({ limit: 10 });
const likePostRateLimit = makeRateLimiter({ limit: 10 });
const unlikePostRateLimit = makeRateLimiter({ limit: 10 });

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
  expressAdapter(makeLikePostController()),
);

postRoutes.post(
  "/posts/:id/comments",
  authMiddleware(),
  createCommentRateLimit,
  expressAdapter(makeCreateCommentController()),
);

postRoutes.delete(
  "/posts/:id/likes",
  authMiddleware(),
  unlikePostRateLimit,
  expressAdapter(makeUnlikePostController()),
);
