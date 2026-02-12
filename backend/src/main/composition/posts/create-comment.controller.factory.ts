import type { CreateCommentDTO } from "@domain/usecases/create-comment.contract";
import { CreateCommentController } from "@presentation/controllers/create-comment.controller";
import { createCommentSchema } from "@presentation/validation/create-comment.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeCreateCommentUseCase } from "./create-comment.usecase.factory";

export const makeCreateCommentController = () => {
  const validator = new ZodHttpValidator<CreateCommentDTO>(createCommentSchema);
  const usecase = makeCreateCommentUseCase();
  const controller = new CreateCommentController(validator, usecase);

  return controller;
};
