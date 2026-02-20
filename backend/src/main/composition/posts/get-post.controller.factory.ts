import type { GetPostDTO } from "@domain/usecases/get-post.contract";
import { GetPostController } from "@presentation/controllers/get-post.controller";
import { getPostSchema } from "@presentation/validation/get-post.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeGetPostUseCase } from "./get-post.usecase.factory";

export const makeGetPostController = () => {
  const validator = new ZodHttpValidator<GetPostDTO>(getPostSchema);
  const usecase = makeGetPostUseCase();
  const controller = new GetPostController(validator, usecase);

  return controller;
};
