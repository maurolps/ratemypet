import type {
  DeleteComment,
  DeleteCommentDTO,
} from "@domain/usecases/delete-comment.contract";

export class DeleteCommentUseCaseStub implements DeleteComment {
  async execute(_: DeleteCommentDTO): Promise<void> {}
}
