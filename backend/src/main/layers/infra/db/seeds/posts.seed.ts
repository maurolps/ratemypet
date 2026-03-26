import { faker } from "@faker-js/faker";
import type { PetType } from "@domain/entities/pet";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { makeCreatePostUseCase } from "@main/composition/posts/create-post.usecase.factory";
import {
  isDirectExecution,
  runStandaloneSeed,
  type SeedSummary,
} from "./shared/bootstrap";
import { seedConfig } from "./shared/config";
import { listUsers } from "./shared/queries";
import { pickRandom, randomInt } from "./shared/random";

const petCaptionTemplates = [
  "{name} after a calm afternoon nap.",
  "{name} enjoying a sunny day outside.",
  "{name} waiting for the next snack break.",
  "{name} looking proud after playtime.",
];

const postCaptionTemplates = [
  "{name} says hello to the timeline.",
  "{name} had the best day at the park.",
  "{name} is ready for more treats today.",
  "{name} looking extra photogenic right now.",
];

const buildCaption = (templates: string[], name: string): string => {
  return pickRandom(templates).replaceAll("{name}", name);
};

const buildPetName = (petType: PetType): string => {
  const baseName = faker.person.firstName();
  return petType === "dog" ? baseName : `${baseName} ${faker.word.noun()}`;
};

const buildPetImageUrl = (petType: PetType): string => {
  const seed = `${faker.string.alphanumeric({
    length: 10,
    casing: "lower",
  })}`;

  const image_url = `https://loremflickr.com/seed/${seed}/500/500/${petType}`;

  return image_url;
};

export const seedPosts = async (): Promise<SeedSummary> => {
  const users = await listUsers();

  if (users.length === 0) {
    throw new Error(
      "No users found. Run `npm run seed:users` or `npm run seed` before seeding posts.",
    );
  }

  const petRepository = new PgPetRepository();
  const createPostUseCase = makeCreatePostUseCase();
  let petsCreated = 0;
  let postsCreated = 0;

  for (const user of users) {
    const petsToCreate = randomInt(
      seedConfig.petsPerUser.min,
      seedConfig.petsPerUser.max,
    );

    for (let petIndex = 0; petIndex < petsToCreate; petIndex += 1) {
      const petType = pickRandom(seedConfig.petTypes);
      const petName = buildPetName(petType);
      const pet = await petRepository.save({
        owner_id: user.id,
        petName,
        type: petType,
        image_url: buildPetImageUrl(petType),
        caption: buildCaption(petCaptionTemplates, petName),
      });

      petsCreated += 1;

      const postsToCreate = randomInt(
        seedConfig.postsPerPet.min,
        seedConfig.postsPerPet.max,
      );

      for (let postIndex = 0; postIndex < postsToCreate; postIndex += 1) {
        await createPostUseCase.execute({
          pet_id: pet.id,
          author_id: user.id,
          caption: buildCaption(postCaptionTemplates, petName),
        });

        postsCreated += 1;
      }
    }
  }

  return {
    petsCreated,
    postsCreated,
  };
};

if (isDirectExecution(import.meta.url)) {
  await runStandaloneSeed("posts", seedPosts);
}
