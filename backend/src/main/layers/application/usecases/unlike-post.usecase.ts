import type {
  UnlikePost,
  UnlikePostDTO,
  UnlikePostResult,
} from "@domain/usecases/unlike-post.contract";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type { LikeRepository } from "@application/repositories/like.repository";
import type { UpdateLikesRepository } from "@application/repositories/update-likes.repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import { AppError } from "@application/errors/app-error";

export class UnlikePostUseCase implements UnlikePost {
  constructor(
    private readonly findPostRepository: FindPostRepository,
    private readonly likeRepository: LikeRepository,
    private readonly updateLikesRepository: UpdateLikesRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: UnlikePostDTO): Promise<UnlikePostResult> {
    return await this.unitOfWork.execute(async (transactionClient) => {
      const post = await this.findPostRepository.findById(
        data.post_id,
        transactionClient,
      );

      if (!post) {
        throw new AppError("NOT_FOUND", "The specified post does not exist.");
      }

      const like = { post_id: data.post_id, user_id: data.user_id };
      const existingLike = await this.likeRepository.exists(
        like,
        transactionClient,
      );

      if (!existingLike) {
        return {
          post_id: data.post_id,
          likes_count: post.toState.likes_count,
        };
      }

      await this.likeRepository.delete(like, transactionClient);

      const unlikedPost = post.unlike();
      const savedPost = await this.updateLikesRepository.decrementLikesCount(
        unlikedPost,
        transactionClient,
      );

      return {
        post_id: data.post_id,
        likes_count: savedPost.toState.likes_count,
      };
    });
  }
}
