import { makeGoogleAuthController } from "@main/composition/auth/google-auth.controller.factory";
import { makeLoginController } from "@main/composition/users/login.controller.factory";
import { makeRefreshTokenController } from "@main/composition/users/refresh-token.controller.factory";
import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";

export const authRoutes = Router();

const googleAuthRateLimit = makeRateLimiter({ limit: 10 });
const loginRateLimit = makeRateLimiter({ limit: 10 });
const refreshTokenRateLimit = makeRateLimiter({ limit: 5 });

authRoutes.post(
  "/auth/login",
  loginRateLimit,
  expressAdapter(makeLoginController()),
);

authRoutes.post(
  "/auth/refresh",
  refreshTokenRateLimit,
  expressAdapter(makeRefreshTokenController()),
);

authRoutes.post(
  "/auth/google",
  googleAuthRateLimit,
  expressAdapter(makeGoogleAuthController()),
);
