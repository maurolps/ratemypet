import type {
  CreateComment,
  CreateCommentDTO,
  CreateCommentResult,
} from "@domain/usecases/create-comment.contract";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type { CommentRepository } from "@application/repositories/comment.repository";
import type { UpdateCommentsRepository } from "@application/repositories/update-comments.repository";
import type { ContentModeration } from "@application/ports/content-moderation.contract";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import type { Comment } from "@domain/entities/comment";
import { AppError } from "@application/errors/app-error";
import { isCustomError } from "@application/errors/custom-error";

export class CreateCommentUseCase implements CreateComment {
  constructor(
    private readonly findPostRepository: FindPostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly updateCommentsRepository: UpdateCommentsRepository,
    private readonly contentModeration: ContentModeration,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: CreateCommentDTO): Promise<CreateCommentResult> {
    return await this.unitOfWork.execute(async (transactionClient) => {
      const post = await this.findPostRepository.findById(
        data.post_id,
        transactionClient,
      );

      if (!post) {
        throw new AppError("NOT_FOUND", "The specified post does not exist.");
      }

      const idempotencyKey = {
        post_id: data.post_id,
        author_id: data.author_id,
        idempotency_key: data.idempotency_key,
      };

      const existingComment = await this.commentRepository.findByIdempotencyKey(
        idempotencyKey,
        transactionClient,
      );

      if (existingComment) {
        return this.handleIdempotentResult(existingComment, data, post.toState);
      }

      const moderationResult = await this.contentModeration.execute(
        data.content,
      );
      if (!moderationResult.isAllowed) {
        throw new AppError(
          "UNPROCESSABLE_ENTITY",
          "Comment has inappropriate content.",
        );
      }

      let savedComment: Comment;
      try {
        savedComment = await this.commentRepository.save(
          {
            ...idempotencyKey,
            content: data.content,
          },
          transactionClient,
        );
      } catch (error) {
        if (isCustomError(error)) {
          const duplicateComment =
            await this.commentRepository.findByIdempotencyKey(
              idempotencyKey,
              transactionClient,
            );

          if (duplicateComment) {
            return this.handleIdempotentResult(
              duplicateComment,
              data,
              post.toState,
            );
          }
        }

        throw error;
      }

      const commentedPost = post.comment();
      const savedPost =
        await this.updateCommentsRepository.incrementCommentsCount(
          commentedPost,
          transactionClient,
        );

      return {
        comment: savedComment,
        comments_count: savedPost.toState.comments_count,
      };
    });
  }

  private handleIdempotentResult(
    existingComment: Comment,
    incomingComment: CreateCommentDTO,
    postState: { comments_count: number },
  ): CreateCommentResult {
    if (existingComment.content !== incomingComment.content) {
      throw new AppError(
        "INVALID_PARAM",
        "Idempotency key already used with a different payload.",
      );
    }

    return {
      comment: existingComment,
      comments_count: postState.comments_count,
    };
  }
}
