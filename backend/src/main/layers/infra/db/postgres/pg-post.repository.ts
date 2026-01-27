import { Post, type PostStatus } from "@domain/entities/post";
import type { CreatePostRepository } from "@application/repositories/create-post.repository";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/post.sql";

type PostRow = {
  id?: string;
  pet_id: string;
  author_id: string;
  caption: string;
  status: PostStatus;
  created_at: Date;
  likes_count: number;
  comments_count: number;
};

export class PgPostRepository implements CreatePostRepository {
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async save(post: Post): Promise<Post> {
    const state = post.toState;
    const postRows = await this.pool.query<PostRow>(sql.CREATE_POST, [
      state.pet_id,
      state.author_id,
      state.caption,
      state.status,
    ]);
    const savedPost = postRows.rows[0];
    return Post.rehydrate(savedPost);
  }
}
