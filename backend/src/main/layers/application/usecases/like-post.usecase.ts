import type { Like } from "@domain/entities/like";
import type {
  LikePost,
  LikePostDTO,
  LikePostResult,
} from "@domain/usecases/like-post.contract";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type { LikeRepository } from "@application/repositories/like.repository";
import type { UpdateLikesRepository } from "@application/repositories/update-likes.repository";
import type { UnitOfWork } from "@application/ports/unit-of-work.contract";
import { AppError } from "@application/errors/app-error";
import { isCustomError } from "@application/errors/custom-error";

export class LikePostUseCase implements LikePost {
  constructor(
    private readonly findPostRepository: FindPostRepository,
    private readonly likeRepository: LikeRepository,
    private readonly updateLikesRepository: UpdateLikesRepository,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute(data: LikePostDTO): Promise<LikePostResult> {
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

      if (existingLike) {
        return {
          like: existingLike,
          likes_count: post.toState.likes_count,
        };
      }

      let savedLike: Like;
      try {
        savedLike = await this.likeRepository.save(
          {
            post_id: data.post_id,
            user_id: data.user_id,
          },
          transactionClient,
        );
      } catch (error) {
        if (isCustomError(error))
          return {
            like,
            likes_count: post.toState.likes_count,
          };

        throw error;
      }

      const likedPost = post.like();
      const savedPost = await this.updateLikesRepository.incrementLikesCount(
        likedPost,
        transactionClient,
      );

      return {
        like: savedLike,
        likes_count: savedPost.toState.likes_count,
      };
    });
  }
}
