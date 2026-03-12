import { makeGoogleAuthController } from "@main/composition/auth/google-auth.controller.factory";
import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";

export const authRoutes = Router();

const googleAuthRateLimit = makeRateLimiter({ limit: 10 });

authRoutes.post(
  "/auth/google",
  googleAuthRateLimit,
  expressAdapter(makeGoogleAuthController()),
);
