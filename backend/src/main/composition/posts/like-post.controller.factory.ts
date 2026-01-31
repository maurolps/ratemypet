import type { LikePostDTO } from "@domain/usecases/like-post.contract";
import { LikePostController } from "@presentation/controllers/like-post.controller";
import { likePostSchema } from "@presentation/validation/like-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeLikePostUseCase } from "./like-post.usecase.factory";

export const makeLikePostController = () => {
  const validator = new ZodHttpValidator<LikePostDTO>(likePostSchema);
  const usecase = makeLikePostUseCase();
  const controller = new LikePostController(validator, usecase);

  return controller;
};
