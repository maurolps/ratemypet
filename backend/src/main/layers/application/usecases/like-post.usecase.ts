import type {
  LikePost,
  LikePostDTO,
  LikePostResult,
} from "@domain/usecases/like-post.contract";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type { LikeRepository } from "@application/repositories/like.repository";
import type { UpdatePostRepository } from "@application/repositories/update-post.repository";
import { AppError } from "@application/errors/app-error";

export class LikePostUseCase implements LikePost {
  constructor(
    private readonly findPostRepository: FindPostRepository,
    private readonly likeRepository: LikeRepository,
    private readonly updatePostRepository: UpdatePostRepository,
  ) {}

  async execute(data: LikePostDTO): Promise<LikePostResult> {
    const post = await this.findPostRepository.findById(data.post_id);

    if (!post) {
      throw new AppError("NOT_FOUND", "The specified post does not exist.");
    }

    const like = { post_id: data.post_id, user_id: data.user_id };
    const existingLike = await this.likeRepository.exists(like);

    if (existingLike) {
      return {
        like: existingLike,
        likes_count: post.toState.likes_count,
      };
    }

    const savedLike = await this.likeRepository.save({
      post_id: data.post_id,
      user_id: data.user_id,
    });

    const likedPost = post.like();
    const savedPost = await this.updatePostRepository.update(likedPost);

    return {
      like: savedLike,
      likes_count: savedPost.toState.likes_count,
    };
  }
}
