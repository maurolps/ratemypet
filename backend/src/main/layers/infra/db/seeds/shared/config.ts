import type { PetType } from "@domain/entities/pet";

const parseInteger = (
  key: string,
  fallback: number,
  allowZero = false,
): number => {
  const rawValue = process.env[key];
  if (!rawValue) return fallback;

  const parsedValue = Number.parseInt(rawValue, 10);
  const minimum = allowZero ? 0 : 1;

  if (Number.isNaN(parsedValue) || parsedValue < minimum) {
    throw new Error(
      `Invalid ${key} value "${rawValue}". Expected an integer >= ${minimum}.`,
    );
  }

  return parsedValue;
};

const buildRange = (
  minKey: string,
  maxKey: string,
  defaults: { min: number; max: number },
  allowZero = false,
) => {
  const min = parseInteger(minKey, defaults.min, allowZero);
  const max = parseInteger(maxKey, defaults.max, allowZero);

  if (min > max) {
    throw new Error(
      `Invalid range: ${minKey} cannot be greater than ${maxKey}.`,
    );
  }

  return { min, max };
};

export const seedConfig = {
  usersCount: parseInteger("SEED_USERS_COUNT", 50),
  petsPerUser: buildRange("SEED_MIN_PETS_PER_USER", "SEED_MAX_PETS_PER_USER", {
    min: 1,
    max: 3,
  }),
  postsPerPet: buildRange("SEED_MIN_POSTS_PER_PET", "SEED_MAX_POSTS_PER_PET", {
    min: 1,
    max: 2,
  }),
  commentsPerPost: buildRange(
    "SEED_MIN_COMMENTS_PER_POST",
    "SEED_MAX_COMMENTS_PER_POST",
    { min: 0, max: 5 },
    true,
  ),
  ratingsPerPet: buildRange(
    "SEED_MIN_RATINGS_PER_PET",
    "SEED_MAX_RATINGS_PER_PET",
    { min: 0, max: 8 },
    true,
  ),
  fakerSeed: parseInteger("SEED_FAKER_SEED", 20260312, true),
  petTypes: ["dog", "cat"] as PetType[],
};
