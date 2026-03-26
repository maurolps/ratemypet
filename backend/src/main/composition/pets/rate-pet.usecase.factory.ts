import { RatePetUseCase } from "@application/usecases/rate-pet.usecase";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { PgRateRepository } from "@infra/db/postgres/pg-rate.repository";

export const makeRatePetUseCase = () => {
  const petRepository = new PgPetRepository();
  const rateRepository = new PgRateRepository();
  const usecase = new RatePetUseCase(petRepository, rateRepository);

  return usecase;
};
