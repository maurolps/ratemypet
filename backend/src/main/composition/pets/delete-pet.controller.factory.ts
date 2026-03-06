import type { DeletePetDTO } from "@domain/usecases/delete-pet.contract";
import { DeletePetController } from "@presentation/controllers/delete-pet.controller";
import { deletePetSchema } from "@presentation/validation/delete-pet.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeDeletePetUseCase } from "./delete-pet.usecase.factory";

export const makeDeletePetController = () => {
  const validator = new ZodHttpValidator<DeletePetDTO>(deletePetSchema);
  const usecase = makeDeletePetUseCase();
  const controller = new DeletePetController(validator, usecase);

  return controller;
};
