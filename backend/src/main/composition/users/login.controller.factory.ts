import type { LoginDTO } from "@domain/usecases/login.contract";
import { loginSchema } from "@presentation/validation/login.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { makeLoginUseCase } from "./login.usecase.factory";
import { LoginController } from "@presentation/controllers/login.controler";

export const makeLoginController = () => {
  const validator = new ZodHttpValidator<LoginDTO>(loginSchema);
  const login = makeLoginUseCase();
  const controller = new LoginController(validator, login);
  return controller;
};
