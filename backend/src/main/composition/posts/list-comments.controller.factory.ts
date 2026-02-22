import type { ListCommentsDTO } from "@domain/usecases/list-comments.contract";
import { ListCommentsController } from "@presentation/controllers/list-comments.controller";
import { listCommentsSchema } from "@presentation/validation/list-comments.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeListCommentsUseCase } from "./list-comments.usecase.factory";

export const makeListCommentsController = () => {
  const validator = new ZodHttpValidator<ListCommentsDTO>(listCommentsSchema);
  const usecase = makeListCommentsUseCase();
  const controller = new ListCommentsController(validator, usecase);

  return controller;
};
