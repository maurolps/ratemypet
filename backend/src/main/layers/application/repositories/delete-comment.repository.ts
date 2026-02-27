import type { Transaction } from "@application/ports/unit-of-work.contract";

export type CommentDeleteTarget = {
  id: string;
  post_id: string;
};

export interface DeleteCommentRepository {
  delete(
    comment: CommentDeleteTarget,
    transaction?: Transaction,
  ): Promise<boolean>;
}
