import type { RefreshTokenParsed } from "@domain/usecases/refresh-token.contract";
import { refreshTokenSchema } from "@presentation/validation/refresh-token.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeRefreshTokenUseCase } from "./refresh-token.usecase.factory";
import { RefreshTokenController } from "@presentation/controllers/refresh-token.controller";

export const makeRefreshTokenController = () => {
  const validator = new ZodHttpValidator<RefreshTokenParsed>(
    refreshTokenSchema,
  );
  const refreshTokenUseCase = makeRefreshTokenUseCase();
  const controller = new RefreshTokenController(validator, refreshTokenUseCase);

  return controller;
};
