import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";
import { makeUploadPetController } from "@main/composition/pets/upload-pet.controller.factory";
import { uploadImageMiddleware } from "../middlewares/upload";

export const petRoutes = Router();

const uploadPetRateLimit = makeRateLimiter({ limit: 10 });

petRoutes.post(
  "/pets",
  authMiddleware(),
  uploadImageMiddleware,
  uploadPetRateLimit,
  expressAdapter(makeUploadPetController()),
);
