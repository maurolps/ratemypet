import type {
  CommentIdempotencyKey,
  CommentRepository,
} from "@application/repositories/comment.repository";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Comment } from "@domain/entities/comment";
import { CustomError } from "@application/errors/custom-error";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/comment.sql";

type CommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  idempotency_key: string;
  created_at: Date;
};

export class PgCreateCommentRepository implements CommentRepository {
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async findByIdempotencyKey(
    key: CommentIdempotencyKey,
    transaction?: Transaction,
  ): Promise<Comment | null> {
    const client = (transaction ? transaction : this.pool) as PgPool;
    const queryParams = [key.post_id, key.author_id, key.idempotency_key];

    const commentRows = await client.query<CommentRow>(
      sql.FIND_COMMENT_BY_IDEMPOTENCY_KEY,
      queryParams,
    );

    return commentRows.rows[0] ?? null;
  }

  async save(comment: Comment, transaction?: Transaction): Promise<Comment> {
    const client = (transaction ? transaction : this.pool) as PgPool;
    const queryParams = [
      comment.post_id,
      comment.author_id,
      comment.content,
      comment.idempotency_key,
    ];

    const commentRows = await client.query<CommentRow>(
      sql.CREATE_COMMENT,
      queryParams,
    );

    const savedComment = commentRows.rows[0];
    if (!savedComment) {
      throw new CustomError("UNIQUE_VIOLATION", "The comment already exists.");
    }

    return savedComment;
  }
}
