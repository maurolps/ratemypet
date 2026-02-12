import type {
  CommentIdempotencyKey,
  CommentRepository,
} from "@application/repositories/comment.repository";
import type { Comment } from "@domain/entities/comment";
import { FIXED_DATE } from "../../config/constants";

export class CommentRepositoryStub implements CommentRepository {
  async findByIdempotencyKey(
    _: CommentIdempotencyKey,
  ): Promise<Comment | null> {
    return null;
  }

  async save(comment: Comment): Promise<Comment> {
    return {
      id: "valid_comment_id",
      post_id: comment.post_id,
      author_id: comment.author_id,
      content: comment.content,
      idempotency_key: comment.idempotency_key,
      created_at: FIXED_DATE,
    };
  }
}
