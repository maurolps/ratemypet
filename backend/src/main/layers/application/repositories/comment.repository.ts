import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Comment } from "@domain/entities/comment";

export type CommentIdempotencyKey = Pick<
  Comment,
  "post_id" | "author_id" | "idempotency_key"
>;

export interface CommentRepository {
  findByIdempotencyKey(
    key: CommentIdempotencyKey,
    transaction?: Transaction,
  ): Promise<Comment | null>;
  save(comment: Comment, transaction?: Transaction): Promise<Comment>;
}
