import type { Like } from "@domain/entities/like";
import type { LikeRepository } from "@application/repositories/like.repository";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/like.sql";
import { CustomError } from "@application/errors/custom-error";

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

  async exists(like: Like, transaction?: Transaction): Promise<Like | null> {
    const client = (transaction ? transaction : this.pool) as PgPool;
    const likeRows = await client.query<LikeRow>(sql.FIND_LIKE, [
      like.post_id,
      like.user_id,
    ]);
    const existingLike = likeRows.rows[0] || null;
    return existingLike;
  }

  async save(like: Like, transaction?: Transaction): Promise<Like> {
    const client = (transaction ? transaction : this.pool) as PgPool;
    const likeRows = await client.query<LikeRow>(sql.CREATE_LIKE, [
      like.post_id,
      like.user_id,
    ]);
    const savedLike = likeRows.rows[0];

    if (!savedLike)
      throw new CustomError("UNIQUE_VIOLATION", "The like already exists.");

    return savedLike;
  }

  async delete(like: Like, transaction?: Transaction): Promise<boolean> {
    const client = (transaction ? transaction : this.pool) as PgPool;
    const result = await client.query(sql.DELETE_LIKE, [
      like.post_id,
      like.user_id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }
}
