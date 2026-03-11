import { CreateUserUseCase } from "@application/usecases/create-user.usecase";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";
import { PgAuthIdentityRepository } from "@infra/db/postgres/pg-auth-identity.repository";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { BcryptAdapter } from "@infra/security/bcrypt.adapter";

export const makeCreateUserUseCase = () => {
  const userRepository = new PgUserRepository();
  const authIdentityRepository = new PgAuthIdentityRepository();
  const hasher = new BcryptAdapter();
  const unitOfWork = new PgUnitOfWorkAdapter();
  const usecase = new CreateUserUseCase(
    hasher,
    userRepository,
    authIdentityRepository,
    unitOfWork,
  );

  return usecase;
};
