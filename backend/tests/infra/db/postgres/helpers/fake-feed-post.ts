import type { PostStatus } from "@domain/entities/post";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { generateFakeEmail } from "./fake-email";
import { insertFakePet } from "./fake-pet";
import { insertFakeUser } from "./fake-user";

type InsertFeedPostDTO = {
  id: string;
  caption: string;
  status: PostStatus;
  likes_count: number;
  comments_count: number;
  created_at: Date;
};

export const insertFeedPost = async (
  post: InsertFeedPostDTO,
): Promise<{ post_id: string; author_id: string; pet_id: string }> => {
  const pool = PgPool.getInstance();
  const author = await insertFakeUser(
    generateFakeEmail("pg_feed_query_author"),
  );
  const pet = await insertFakePet(author.id);

  await pool.query(
    `
    INSERT INTO posts (
      id,
      pet_id,
      author_id,
      caption,
      status,
      likes_count,
      comments_count,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      post.id,
      pet.id,
      author.id,
      post.caption,
      post.status,
      post.likes_count,
      post.comments_count,
      post.created_at,
    ],
  );

  return {
    post_id: post.id,
    author_id: author.id,
    pet_id: pet.id,
  };
};
