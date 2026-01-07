import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";
import { uploadPetSchema } from "@presentation/validation/upload-pet.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeUploadPetUseCase } from "./upload-pet.usecase.factory";
import { UploadPetController } from "@presentation/controllers/upload-pet.controller";

export const makeUploadPetController = () => {
  const validator = new ZodHttpValidator<UploadPetDTO>(uploadPetSchema);
  const usecase = makeUploadPetUseCase();
  const controller = new UploadPetController(validator, usecase);
  return controller;
};
