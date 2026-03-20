import { GetProfileUseCase } from "@application/usecases/get-profile.usecase";
import { PgProfileQuery } from "@infra/db/postgres/queries/pg-profile.query";

export const makeGetProfileUseCase = () => {
  const profileQuery = new PgProfileQuery();
  const usecase = new GetProfileUseCase(profileQuery, profileQuery);

  return usecase;
};
