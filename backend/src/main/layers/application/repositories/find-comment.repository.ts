import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Comment } from "@domain/entities/comment";

export interface FindCommentRepository {
  findByIdAndPostId(
    commentId: string,
    postId: string,
    transaction?: Transaction,
  ): Promise<Comment | null>;
}
