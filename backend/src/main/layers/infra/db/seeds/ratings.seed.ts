import { RATE_VALUES } from "@domain/entities/rate";
import { makeRatePetUseCase } from "@main/composition/pets/rate-pet.usecase.factory";
import {
  isDirectExecution,
  runStandaloneSeed,
  type SeedSummary,
} from "./shared/bootstrap";
import { seedConfig } from "./shared/config";
import { listPets, listUsers } from "./shared/queries";
import { pickRandom, randomInt, sampleSize } from "./shared/random";

export const seedRatings = async (): Promise<SeedSummary> => {
  const users = await listUsers();
  const pets = await listPets();

  if (users.length === 0) {
    throw new Error(
      "No users found. Run `npm run seed:users` or `npm run seed` before seeding ratings.",
    );
  }

  if (pets.length === 0) {
    throw new Error(
      "No pets found. Run `npm run seed:posts` or `npm run seed` before seeding ratings.",
    );
  }

  const ratePetUseCase = makeRatePetUseCase();
  let ratingsCreated = 0;

  for (const pet of pets) {
    const eligibleRaters = users.filter((user) => user.id !== pet.owner_id);
    const raterPool = eligibleRaters.length > 0 ? eligibleRaters : users;
    const ratingsToCreate = Math.min(
      randomInt(seedConfig.ratingsPerPet.min, seedConfig.ratingsPerPet.max),
      raterPool.length,
    );

    const selectedRaters = sampleSize(raterPool, ratingsToCreate);

    for (const rater of selectedRaters) {
      await ratePetUseCase.execute({
        petId: pet.id,
        userId: rater.id,
        rate: pickRandom([...RATE_VALUES]),
      });

      ratingsCreated += 1;
    }
  }

  return { ratingsCreated };
};

if (isDirectExecution(import.meta.url)) {
  await runStandaloneSeed("ratings", seedRatings);
}
