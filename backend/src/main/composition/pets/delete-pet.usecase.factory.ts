import { DeletePetUseCase } from "@application/usecases/delete-pet.usecase";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";

export const makeDeletePetUseCase = () => {
  const petRepository = new PgPetRepository();
  const postRepository = new PgPostRepository();
  const unitOfWork = new PgUnitOfWorkAdapter();

  const usecase = new DeletePetUseCase(
    petRepository,
    petRepository,
    postRepository,
    postRepository,
    unitOfWork,
  );

  return usecase;
};
