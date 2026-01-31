import { Post, type PostStatus } from "@domain/entities/post";
import type { CreatePostRepository } from "@application/repositories/create-post.repository";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type { UpdateLikesRepository } from "@application/repositories/update-likes.repository";
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

export class PgPostRepository
  implements CreatePostRepository, FindPostRepository, UpdateLikesRepository
{
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

  async findById(postId: string): Promise<Post | null> {
    const postRows = await this.pool.query<PostRow>(sql.FIND_POST_BY_ID, [
      postId,
    ]);
    const post = postRows.rows[0] || null;
    return post ? Post.rehydrate(post) : null;
  }

  async updateLikesCount(post: Post): Promise<Post> {
    const state = post.toState;
    const postRows = await this.pool.query<PostRow>(sql.UPDATE_LIKES_COUNT, [
      state.id,
    ]);
    const updatedPost = postRows.rows[0];
    return Post.rehydrate(updatedPost);
  }
}
