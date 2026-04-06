import type { GetRankingDTO } from "@domain/usecases/get-ranking.contract";
import { GetRankingController } from "@presentation/controllers/get-ranking.controller";
import { getRankingSchema } from "@presentation/validation/get-ranking.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeGetRankingUseCase } from "./get-ranking.usecase.factory";

export const makeGetRankingController = () => {
  const validator = new ZodHttpValidator<GetRankingDTO>(getRankingSchema);
  const usecase = makeGetRankingUseCase();
  const controller = new GetRankingController(validator, usecase);

  return controller;
};
