import type { UpdateProfileDTO } from "@domain/usecases/update-profile.contract";
import { UpdateProfileController } from "@presentation/controllers/update-profile.controller";
import { updateProfileSchema } from "@presentation/validation/update-profile.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeUpdateProfileUseCase } from "./update-profile.usecase.factory";

export const makeUpdateProfileController = () => {
  const validator = new ZodHttpValidator<UpdateProfileDTO>(updateProfileSchema);
  const usecase = makeUpdateProfileUseCase();
  const controller = new UpdateProfileController(validator, usecase);

  return controller;
};
