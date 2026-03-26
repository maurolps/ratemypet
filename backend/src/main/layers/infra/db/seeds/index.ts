import {
  disconnectSeedDb,
  ensureEmptyDatabase,
  initializeSeedDb,
  logSeedSummary,
  summarizeDatabase,
} from "./shared/bootstrap";
import { getDatabaseSnapshot } from "./shared/queries";
import { seedComments } from "./comments.seed";
import { seedPosts } from "./posts.seed";
import { seedRatings } from "./ratings.seed";
import { seedUsers } from "./users.seed";

const main = async (): Promise<void> => {
  try {
    await initializeSeedDb();
    await ensureEmptyDatabase();

    logSeedSummary("users", await seedUsers());
    logSeedSummary("posts", await seedPosts());
    logSeedSummary("comments", await seedComments());
    logSeedSummary("ratings", await seedRatings());
    logSeedSummary("database", summarizeDatabase(await getDatabaseSnapshot()));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[seed] ${message}`);
    process.exitCode = 1;
  } finally {
    await disconnectSeedDb();
  }
};

await main();
