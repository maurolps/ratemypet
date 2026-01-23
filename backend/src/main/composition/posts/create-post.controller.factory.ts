import type { CreatePostDTO } from "@domain/usecases/create-post.contract";
import { CreatePostController } from "@presentation/controllers/create-post.controller";
import { createPostSchema } from "@presentation/validation/create-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeCreatePostUseCase } from "./create-post.usecase.factory";

export const makeCreatePostController = () => {
  const validator = new ZodHttpValidator<CreatePostDTO>(createPostSchema);
  const usecase = makeCreatePostUseCase();
  const controller = new CreatePostController(validator, usecase);

  return controller;
};
