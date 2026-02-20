import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/authenticate";
import { makeCreatePostController } from "@main/composition/posts/create-post.controller.factory";
import { makeCreateCommentController } from "@main/composition/posts/create-comment.controller.factory";
import { makeGetPostController } from "@main/composition/posts/get-post.controller.factory";
import { makeLikePostController } from "@main/composition/posts/like-post.controller.factory";
import { makeUnlikePostController } from "@main/composition/posts/unlike-post.controller.factory";

export const postRoutes = Router();

const createPostRateLimit = makeRateLimiter({ limit: 5 });
const getPostRateLimit = makeRateLimiter({ limit: 30 });
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

postRoutes.get(
  "/posts/:id",
  optionalAuthMiddleware(),
  getPostRateLimit,
  expressAdapter(makeGetPostController()),
);

postRoutes.delete(
  "/posts/:id/likes",
  authMiddleware(),
  unlikePostRateLimit,
  expressAdapter(makeUnlikePostController()),
);
