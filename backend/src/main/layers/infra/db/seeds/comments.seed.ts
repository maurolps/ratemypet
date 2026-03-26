import { faker } from "@faker-js/faker";
import { makeCreateCommentUseCase } from "@main/composition/posts/create-comment.usecase.factory";
import {
  isDirectExecution,
  runStandaloneSeed,
  type SeedSummary,
} from "./shared/bootstrap";
import { seedConfig } from "./shared/config";
import { listPublishedPosts, listUsers } from "./shared/queries";
import { pickRandom, randomInt } from "./shared/random";

const commentTemplates = [
  "This is such a great photo.",
  "Absolutely adorable.",
  "That face made my day.",
  "Top tier pet content right here.",
  "This one deserves all the likes.",
  "Such a wholesome moment.",
];

export const seedComments = async (): Promise<SeedSummary> => {
  const users = await listUsers();
  const posts = await listPublishedPosts();

  if (users.length === 0) {
    throw new Error(
      "No users found. Run `npm run seed:users` or `npm run seed` before seeding comments.",
    );
  }

  if (posts.length === 0) {
    throw new Error(
      "No published posts found. Run `npm run seed:posts` or `npm run seed` before seeding comments.",
    );
  }

  const createCommentUseCase = makeCreateCommentUseCase();
  let commentsCreated = 0;

  for (const post of posts) {
    const commentsToCreate = randomInt(
      seedConfig.commentsPerPost.min,
      seedConfig.commentsPerPost.max,
    );

    const eligibleAuthors = users.filter((user) => user.id !== post.author_id);
    const authorPool = eligibleAuthors.length > 0 ? eligibleAuthors : users;

    for (
      let commentIndex = 0;
      commentIndex < commentsToCreate;
      commentIndex += 1
    ) {
      await createCommentUseCase.execute({
        post_id: post.id,
        author_id: pickRandom(authorPool).id,
        content: pickRandom(commentTemplates),
        idempotency_key: faker.string.uuid(),
      });

      commentsCreated += 1;
    }
  }

  return { commentsCreated };
};

if (isDirectExecution(import.meta.url)) {
  await runStandaloneSeed("comments", seedComments);
}
