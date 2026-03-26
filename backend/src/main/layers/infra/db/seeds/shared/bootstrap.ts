import { faker } from "@faker-js/faker";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { pathToFileURL } from "node:url";
import { seedConfig } from "./config";
import { getDatabaseSnapshot, type DatabaseSnapshot } from "./queries";

const SEED_DATABASE_URL =
  "postgres://ratemypet:ratemypet@localhost:5432/ratemypet_dev?sslmode=disable";

export type SeedSummary = Record<string, number>;

const pool = PgPool.getInstance();

const formatEntries = (entries: [string, number][]): string => {
  return entries.map(([key, value]) => `${key}=${value}`).join(", ");
};

export const initializeSeedDb = async (): Promise<void> => {
  faker.seed(seedConfig.fakerSeed);
  pool.initialize(SEED_DATABASE_URL);
  await pool.health();
};

export const disconnectSeedDb = async (): Promise<void> => {
  try {
    await pool.disconnect();
  } catch {}
};

export const ensureEmptyDatabase = async (): Promise<void> => {
  const snapshot = await getDatabaseSnapshot();
  const nonEmptyEntries = Object.entries(snapshot).filter(
    ([, value]) => value > 0,
  );

  if (nonEmptyEntries.length > 0) {
    const details = formatEntries(nonEmptyEntries as [string, number][]);
    throw new Error(
      `Database is not empty (${details}). Run \`npm run db:reseed\` or reset the DB before \`npm run seed\`.`,
    );
  }
};

export const logSeedSummary = (
  seedName: string,
  summary: SeedSummary,
): void => {
  console.log(`[seed:${seedName}] ${formatEntries(Object.entries(summary))}`);
};

export const runStandaloneSeed = async (
  seedName: string,
  seed: () => Promise<SeedSummary>,
): Promise<void> => {
  try {
    await initializeSeedDb();
    const summary = await seed();
    logSeedSummary(seedName, summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[seed:${seedName}] ${message}`);
    process.exitCode = 1;
  } finally {
    await disconnectSeedDb();
  }
};

export const isDirectExecution = (metaUrl: string): boolean => {
  const entryFile = process.argv[1];

  if (!entryFile) return false;

  return pathToFileURL(entryFile).href === metaUrl;
};

export const summarizeDatabase = (snapshot: DatabaseSnapshot): SeedSummary => {
  return {
    users: snapshot.users,
    auth_identities: snapshot.auth_identities,
    pets: snapshot.pets,
    posts: snapshot.posts,
    comments: snapshot.comments,
    likes: snapshot.likes,
    ratings: snapshot.ratings,
  };
};
