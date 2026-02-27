import { AppError } from "@application/errors/app-error";
import type { DeleteCommentRepository } from "@application/repositories/delete-comment.repository";
import type { FindCommentRepository } from "@application/repositories/find-comment.repository";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type { UpdateCommentsRepository } from "@application/repositories/update-comments.repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import type {
  DeleteComment,
  DeleteCommentDTO,
} from "@domain/usecases/delete-comment.contract";

export class DeleteCommentUseCase implements DeleteComment {
  constructor(
    private readonly findPostRepository: FindPostRepository,
    private readonly findCommentRepository: FindCommentRepository,
    private readonly deleteCommentRepository: DeleteCommentRepository,
    private readonly updateCommentsRepository: UpdateCommentsRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: DeleteCommentDTO): Promise<void> {
    await this.unitOfWork.execute(async (transactionClient) => {
      const post = await this.findPostRepository.findById(
        data.post_id,
        transactionClient,
      );

      if (!post) {
        throw new AppError("NOT_FOUND", "The specified post does not exist.");
      }

      const comment = await this.findCommentRepository.findByIdAndPostId(
        data.comment_id,
        data.post_id,
        transactionClient,
      );

      if (!comment) {
        return;
      }

      const isCommentAuthor = comment.author_id === data.user_id;
      const isPostAuthor = post.toState.author_id === data.user_id;
      if (!isCommentAuthor && !isPostAuthor) {
        throw new AppError(
          "FORBIDDEN",
          "You do not have permission to delete this comment.",
        );
      }

      const wasDeleted = await this.deleteCommentRepository.delete(
        {
          id: data.comment_id,
          post_id: data.post_id,
        },
        transactionClient,
      );

      if (!wasDeleted) {
        return;
      }

      const uncommentedPost = post.uncomment();
      await this.updateCommentsRepository.decrementCommentsCount(
        uncommentedPost,
        transactionClient,
      );
    });
  }
}
