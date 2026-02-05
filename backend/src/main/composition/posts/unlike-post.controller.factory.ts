import type { UnlikePostDTO } from "@domain/usecases/unlike-post.contract";
import { UnlikePostController } from "@presentation/controllers/unlike-post.controller";
import { likePostSchema } from "@presentation/validation/like-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeUnlikePostUseCase } from "./unlike-post.usecase.factory";

export const makeUnlikePostController = () => {
  const validator = new ZodHttpValidator<UnlikePostDTO>(likePostSchema);
  const usecase = makeUnlikePostUseCase();
  const controller = new UnlikePostController(validator, usecase);

  return controller;
};
