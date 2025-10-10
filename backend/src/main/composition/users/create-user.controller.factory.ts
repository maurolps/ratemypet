import { CreateUserController } from "@presentation/controllers/create-user.controller";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { createUserSchema } from "@presentation/validation/create-user.schema";
import { makeCreateUserUseCase } from "./create-user.usecase.factory";

export const makeCreateUserController = () => {
  const validator = new ZodHttpValidator(createUserSchema);
  const usecase = makeCreateUserUseCase();
  const controller = new CreateUserController(usecase, validator);
  return controller;
};
