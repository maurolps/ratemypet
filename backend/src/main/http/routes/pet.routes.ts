import { Router } from "express";
import { expressAdapter } from "../adapters/express-controller.adapter";
import { makeRateLimiter } from "../middlewares/rate-limit";
import { authMiddleware } from "../middlewares/authenticate";
import { makeUploadPetController } from "@main/composition/pets/upload-pet.controller.factory";
import { makeDeletePetController } from "@main/composition/pets/delete-pet.controller.factory";
import { makeRatePetController } from "@main/composition/pets/rate-pet.controller.factory";
import { uploadImageMiddleware } from "../middlewares/upload";

export const petRoutes = Router();

const uploadPetRateLimit = makeRateLimiter({ limit: 10 });
const deletePetRateLimit = makeRateLimiter({ limit: 10 });
const ratePetRateLimit = makeRateLimiter({ limit: 10 });

petRoutes.post(
  "/pets",
  authMiddleware(),
  uploadImageMiddleware,
  uploadPetRateLimit,
  expressAdapter(makeUploadPetController()),
);

petRoutes.delete(
  "/pets/:id",
  authMiddleware(),
  deletePetRateLimit,
  expressAdapter(makeDeletePetController()),
);

petRoutes.post(
  "/pets/:id/rate",
  authMiddleware(),
  ratePetRateLimit,
  expressAdapter(makeRatePetController()),
);
