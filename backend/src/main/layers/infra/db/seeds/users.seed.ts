import { faker } from "@faker-js/faker";
import { makeDefaultUserProfile } from "@application/helpers/default-user-profile";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import {
  isDirectExecution,
  runStandaloneSeed,
  type SeedSummary,
} from "./shared/bootstrap";
import { seedConfig } from "./shared/config";

export const seedUsers = async (): Promise<SeedSummary> => {
  const userRepository = new PgUserRepository();

  for (let index = 0; index < seedConfig.usersCount; index += 1) {
    const fullName = faker.person.fullName();
    const email = `seed.user.${index + 1}.${faker.string.alphanumeric({
      length: 6,
      casing: "lower",
    })}@example.com`;

    await userRepository.create({
      name: fullName,
      email,
      ...makeDefaultUserProfile(fullName),
    });
  }

  return { usersCreated: seedConfig.usersCount };
};

if (isDirectExecution(import.meta.url)) {
  await runStandaloneSeed("users", seedUsers);
}
