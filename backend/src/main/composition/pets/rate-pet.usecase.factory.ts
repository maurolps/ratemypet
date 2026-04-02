import { RatePetUseCase } from "@application/usecases/rate-pet.usecase";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";

export const makeRatePetUseCase = () => {
  const petRepository = new PgPetRepository();
  const rateRepository = new PgRateRepository();
  const unitOfWork = new PgUnitOfWorkAdapter();
  const usecase = new RatePetUseCase(
    petRepository,
    rateRepository,
    petRepository,
    unitOfWork,
  );

  return usecase;
};
