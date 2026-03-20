import type { GetMeDTO } from "@domain/usecases/get-me.contract";
import { GetMeController } from "@presentation/controllers/get-me.controller";
import { getMeSchema } from "@presentation/validation/get-me.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeGetMeUseCase } from "./get-me.usecase.factory";

export const makeGetMeController = () => {
  const validator = new ZodHttpValidator<GetMeDTO>(getMeSchema);
  const usecase = makeGetMeUseCase();
  const controller = new GetMeController(validator, usecase);

  return controller;
};
