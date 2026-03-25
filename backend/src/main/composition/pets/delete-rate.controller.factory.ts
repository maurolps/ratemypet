import type { DeleteRateDTO } from "@domain/usecases/delete-rate.contract";
import { DeleteRateController } from "@presentation/controllers/delete-rate.controller";
import { deleteRateSchema } from "@presentation/validation/delete-rate.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeDeleteRateUseCase } from "./delete-rate.usecase.factory";

export const makeDeleteRateController = () => {
  const validator = new ZodHttpValidator<DeleteRateDTO>(deleteRateSchema);
  const usecase = makeDeleteRateUseCase();
  const controller = new DeleteRateController(validator, usecase);

  return controller;
};
