import type { DeletePostDTO } from "@domain/usecases/delete-post.contract";
import { DeletePostController } from "@presentation/controllers/delete-post.controller";
import { deletePostSchema } from "@presentation/validation/delete-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeDeletePostUseCase } from "./delete-post.usecase.factory";

export const makeDeletePostController = () => {
  const validator = new ZodHttpValidator<DeletePostDTO>(deletePostSchema);
  const usecase = makeDeletePostUseCase();
  const controller = new DeletePostController(validator, usecase);

  return controller;
};
