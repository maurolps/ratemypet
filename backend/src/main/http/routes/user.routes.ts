import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";
import { makeLoginController } from "@main/composition/users/login.controller.factory";
import { makeRateLimiter } from "../middlewares/rate-limit";

export const userRoutes = Router();

const loginRateLimit = makeRateLimiter({ limit: 10 });
const createUserRateLimit = makeRateLimiter({ limit: 5 });

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
