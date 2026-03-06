import type { DeleteCommentDTO } from "@domain/usecases/delete-comment.contract";
import { DeleteCommentController } from "@presentation/controllers/delete-comment.controller";
import { deleteCommentSchema } from "@presentation/validation/delete-comment.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeDeleteCommentUseCase } from "./delete-comment.usecase.factory";

export const makeDeleteCommentController = () => {
  const validator = new ZodHttpValidator<DeleteCommentDTO>(deleteCommentSchema);
  const usecase = makeDeleteCommentUseCase();
  const controller = new DeleteCommentController(validator, usecase);

  return controller;
};
