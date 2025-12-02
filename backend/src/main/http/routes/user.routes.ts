import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";
import { makeLoginController } from "@main/composition/users/login.controller.factory";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { makeRefreshTokenController } from "@main/composition/users/refresh-token.controller.factory";

export const userRoutes = Router();

const loginRateLimit = makeRateLimiter({ limit: 10 });
const createUserRateLimit = makeRateLimiter({ limit: 5 });
const refreshTokenRateLimit = makeRateLimiter({ limit: 5 });

userRoutes.post(
  "/users",
  createUserRateLimit,
  expressAdapter(makeCreateUserController()),
);
userRoutes.post(
  "/users/login",
  loginRateLimit,
  expressAdapter(makeLoginController()),
);

userRoutes.post(
  "/users/refresh-token",
  refreshTokenRateLimit,
  expressAdapter(makeRefreshTokenController()),
);
