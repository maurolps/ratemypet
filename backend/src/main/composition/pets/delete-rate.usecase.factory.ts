import { DeleteRateUseCase } from "@application/usecases/delete-rate.usecase";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";

export const makeDeleteRateUseCase = () => {
  const petRepository = new PgPetRepository();
  const rateRepository = new PgRateRepository();
  const usecase = new DeleteRateUseCase(petRepository, rateRepository);

  return usecase;
};
