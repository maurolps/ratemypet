import type { GetFeedDTO } from "@domain/usecases/get-feed.contract";
import { GetFeedController } from "@presentation/controllers/get-feed.controller";
import { getFeedSchema } from "@presentation/validation/get-feed.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeGetFeedUseCase } from "./get-feed.usecase.factory";

export const makeGetFeedController = () => {
  const validator = new ZodHttpValidator<GetFeedDTO>(getFeedSchema);
  const usecase = makeGetFeedUseCase();
  const controller = new GetFeedController(validator, usecase);

  return controller;
};
