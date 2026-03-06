import type {
  CommentDeleteTarget,
  DeleteCommentRepository,
} from "@application/repositories/delete-comment.repository";

export class DeleteCommentRepositoryStub implements DeleteCommentRepository {
  async delete(_: CommentDeleteTarget): Promise<boolean> {
    return true;
  }
}
