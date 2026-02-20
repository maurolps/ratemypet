import { Post } from "@domain/entities/post";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { generateFakeEmail } from "./fake-email";
import { insertFakePet } from "./fake-pet";
import { insertFakeUser } from "./fake-user";

export const insertFakePost = async (): Promise<{
  post_id: string;
  owner_id: string;
}> => {
  const postRepository = new PgPostRepository();
  const owner = await insertFakeUser(generateFakeEmail("pg_post_query_owner"));
  const pet = await insertFakePet(owner.id);
  const post = await postRepository.save(
    Post.create({
      pet_id: pet.id,
      author_id: owner.id,
      default_caption: "Default caption",
      caption: "Post caption",
    }),
  );

  return {
    post_id: post.toState.id ?? "",
    owner_id: owner.id,
  };
};
