import type { Post } from "@domain/entities/post";
import type { CreatePostRepository } from "@application/repositories/create-post.repository";
import type { CreatePostDTO } from "@domain/usecases/create-post.contract";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/post.sql";

export class PgPostRepository implements CreatePostRepository {
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async create(postDTO: CreatePostDTO): Promise<Post> {
    const { pet_id, author_id, caption } = postDTO;
    const postRows = await this.pool.query<Post>(sql.CREATE_POST, [
      pet_id,
      author_id,
      caption,
      "PUBLISHED",
    ]);
    const post = postRows.rows[0];
    return post;
  }
}
