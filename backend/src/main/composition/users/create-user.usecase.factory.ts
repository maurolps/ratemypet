import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { BcryptAdapter } from "@infra/security/bcrypt.adapter";

export const makeCreateUserUseCase = () => {
  const repository = new PgUserRepository();
  const hasher = new BcryptAdapter();
  const usecase = new CreateUserUseCase(repository, hasher, repository);

  return usecase;
};
