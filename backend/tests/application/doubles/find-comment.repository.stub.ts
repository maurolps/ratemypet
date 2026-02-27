import type { FindCommentRepository } from "@application/repositories/find-comment.repository";
import type { Comment } from "@domain/entities/comment";
import { FIXED_DATE } from "../../config/constants";

export class FindCommentRepositoryStub implements FindCommentRepository {
  async findByIdAndPostId(
    commentId: string,
    postId: string,
  ): Promise<Comment | null> {
    return {
      id: commentId,
      post_id: postId,
      author_id: "valid_comment_author_id",
      content: "valid_comment_content",
      idempotency_key: "valid_idempotency_key",
      created_at: FIXED_DATE,
    };
  }
}
