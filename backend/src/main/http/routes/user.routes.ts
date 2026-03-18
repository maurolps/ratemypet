import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";
import { makeGetMeController } from "@main/composition/users/get-me.controller.factory";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";

export const userRoutes = Router();

const createUserRateLimit = makeRateLimiter({ limit: 5 });
const getMeRateLimit = makeRateLimiter({ limit: 30 });

userRoutes.post(
  "/users",
  createUserRateLimit,
  expressAdapter(makeCreateUserController()),
);

userRoutes.get(
  "/users/me",
  authMiddleware(),
  getMeRateLimit,
  expressAdapter(makeGetMeController()),
);
