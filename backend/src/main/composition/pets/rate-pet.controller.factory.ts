import type { RatePetDTO } from "@domain/usecases/rate-pet.contract";
import { RatePetController } from "@presentation/controllers/rate-pet.controller";
import { ratePetSchema } from "@presentation/validation/rate-pet.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeRatePetUseCase } from "./rate-pet.usecase.factory";

export const makeRatePetController = () => {
  const validator = new ZodHttpValidator<RatePetDTO>(ratePetSchema);
  const usecase = makeRatePetUseCase();
  const controller = new RatePetController(validator, usecase);

  return controller;
};
