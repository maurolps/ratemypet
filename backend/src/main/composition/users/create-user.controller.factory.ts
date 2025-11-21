import type { CreateUserDTO } from "@domain/usecases/create-user.contract";
import { CreateUserController } from "@presentation/controllers/create-user.controller";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { createUserSchema } from "@presentation/validation/create-user.schema";
import { makeCreateUserUseCase } from "./create-user.usecase.factory";
import { makeTokenIssuer } from "./token-issuer.factory";

export const makeCreateUserController = () => {
  const validator = new ZodHttpValidator<CreateUserDTO>(createUserSchema);
  const usecase = makeCreateUserUseCase();
  const tokenIssuer = makeTokenIssuer();
  const controller = new CreateUserController(usecase, validator, tokenIssuer);
  return controller;
};
