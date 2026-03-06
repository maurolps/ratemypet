import { AppError } from "@application/errors/app-error";
import type { DeletePostRepository } from "@application/repositories/delete-post.repository";
import type { FindPostRepository } from "@application/repositories/find-post.repository";
import type {
  DeletePost,
  DeletePostDTO,
} from "@domain/usecases/delete-post.contract";

export class DeletePostUseCase implements DeletePost {
  constructor(
    private readonly findPostRepository: FindPostRepository,
    private readonly deletePostRepository: DeletePostRepository,
  ) {}

  async execute(data: DeletePostDTO): Promise<void> {
    const post = await this.findPostRepository.findById(data.post_id);

    if (!post) {
      throw new AppError("NOT_FOUND", "The specified post does not exist.");
    }

    if (post.toState.author_id !== data.user_id) {
      throw new AppError(
        "FORBIDDEN",
        "You do not have permission to delete this post.",
      );
    }

    if (post.toState.status === "DELETED") {
      return;
    }

    const deletedPost = post.delete();
    await this.deletePostRepository.deletePost(deletedPost);

    return;
  }
}
