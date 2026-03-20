import type { GetProfileDTO } from "@domain/usecases/get-profile.contract";
import { GetProfileController } from "@presentation/controllers/get-profile.controller";
import { getProfileSchema } from "@presentation/validation/get-profile.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeGetProfileUseCase } from "./get-profile.usecase.factory";

export const makeGetProfileController = () => {
  const validator = new ZodHttpValidator<GetProfileDTO>(getProfileSchema);
  const usecase = makeGetProfileUseCase();
  const controller = new GetProfileController(validator, usecase);

  return controller;
};
