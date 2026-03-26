import { faker } from "@faker-js/faker";

export const randomInt = (min: number, max: number): number => {
  return faker.number.int({ min, max });
};

export const pickRandom = <T>(items: T[]): T => {
  if (items.length === 0) {
    throw new Error("Cannot pick a random item from an empty collection.");
  }

  return items[randomInt(0, items.length - 1)];
};

export const sampleSize = <T>(items: T[], count: number): T[] => {
  if (count <= 0) return [];

  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = randomInt(0, index);
    const current = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};
