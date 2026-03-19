import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeCreateUserController } from "@main/composition/users/create-user.controller.factory";
import { makeGetMeController } from "@main/composition/users/get-me.controller.factory";
import { makeGetProfileController } from "@main/composition/users/get-profile.controller.factory";
import { makeUpdateProfileController } from "@main/composition/users/update-profile.controller.factory";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";

export const userRoutes = Router();

const createUserRateLimit = makeRateLimiter({ limit: 5 });
const getMeRateLimit = makeRateLimiter({ limit: 30 });
const getProfileRateLimit = makeRateLimiter({ limit: 30 });
const updateProfileRateLimit = makeRateLimiter({ limit: 10 });

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

userRoutes.patch(
  "/users/me",
  authMiddleware(),
  updateProfileRateLimit,
  expressAdapter(makeUpdateProfileController()),
);

userRoutes.get(
  "/users/:id",
  getProfileRateLimit,
  expressAdapter(makeGetProfileController()),
);
