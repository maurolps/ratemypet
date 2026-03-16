import type { GoogleAuthDTO } from "@domain/usecases/google-auth.contract";
import { GoogleAuthController } from "@presentation/controllers/google-auth.controller";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { googleAuthSchema } from "@presentation/validation/google-auth.schema";
import { makeGoogleAuthUseCase } from "./google-auth.usecase.factory";

export const makeGoogleAuthController = () => {
  const validator = new ZodHttpValidator<GoogleAuthDTO>(googleAuthSchema);
  const googleAuth = makeGoogleAuthUseCase();

  return new GoogleAuthController(validator, googleAuth);
};
