import type { Like } from "@domain/entities/like";
import type { LikeRepository } from "@application/repositories/like.repository";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/like.sql";

type LikeRow = {
  post_id: string;
  user_id: string;
  created_at: Date;
};

export class PgLikeRepository implements LikeRepository {
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async exists(like: Like): Promise<Like | null> {
    const likeRows = await this.pool.query<LikeRow>(sql.FIND_LIKE, [
      like.post_id,
      like.user_id,
    ]);
    const existingLike = likeRows.rows[0] || null;
    return existingLike;
  }

  async save(like: Like): Promise<Like> {
    const likeRows = await this.pool.query<LikeRow>(sql.CREATE_LIKE, [
      like.post_id,
      like.user_id,
    ]);
    const savedLike = likeRows.rows[0];
    return savedLike;
  }
}
