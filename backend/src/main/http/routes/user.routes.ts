import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";
import { makeRateLimiter } from "../middlewares/rate-limit";

export const userRoutes = Router();

const createUserRateLimit = makeRateLimiter({ limit: 5 });

userRoutes.post(
  "/users",
  createUserRateLimit,
  expressAdapter(makeCreateUserController()),
);
