import { Post } from "@domain/entities/post";
import type { PgPostRepository } from "@infra/db/postgres/pg-post.repository";

export const createPost = async (
  postRepository: PgPostRepository,
  petId: string,
  authorId: string,
  caption = "A valid caption",
) => {
  return postRepository.save(
    Post.create({
      pet_id: petId,
      author_id: authorId,
      default_caption: "A default caption",
      caption,
    }),
  );
};
