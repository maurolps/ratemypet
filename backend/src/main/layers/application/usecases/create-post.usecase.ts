import type {
  CreatePost,
  CreatePostDTO,
} from "@domain/usecases/create-post.contract";
import type { Post } from "@domain/entities/post";
import type { FindPetRepository } from "@application/repositories/find-pet.repository";
import { AppError } from "@application/errors/app-error";
import type { ContentModeration } from "@application/ports/content-moderation.contract";

export class CreatePostUseCase implements CreatePost {
  constructor(
    private readonly findPetRepository: FindPetRepository,
    private readonly contentModeration: ContentModeration,
  ) {}

  async execute(postDTO: CreatePostDTO): Promise<Post> {
    const pet = await this.findPetRepository.findById(postDTO.pet_id);

    if (!pet) {
      throw new AppError("NOT_FOUND", "The specified pet does not exist.");
    }

    if (pet.owner_id !== postDTO.author_id) {
      throw new AppError(
        "FORBIDDEN",
        "You do not have permission to create a post for this pet.",
      );
    }

    const caption = postDTO.caption || pet.caption;

    if (postDTO.caption) {
      const moderationResult = await this.contentModeration.execute(caption);
      if (!moderationResult.isAllowed)
        throw new AppError(
          "UNPROCESSABLE_ENTITY",
          "Caption has inappropriate content.",
        );
    }

    const post: Post = {
      id: "generated_post_id",
      pet_id: postDTO.pet_id,
      author_id: postDTO.author_id,
      caption,
      status: "PUBLISHED",
      created_at: new Date(),
    };
    return post;
  }
}
