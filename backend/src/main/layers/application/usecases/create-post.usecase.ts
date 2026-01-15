import type {
  CreatePost,
  CreatePostDTO,
} from "@domain/usecases/create-post.contract";
import type { Post } from "@domain/entities/post";
import type { FindPetRepository } from "@application/repositories/find-pet.repository";
import { AppError } from "@application/errors/app-error";

export class CreatePostUseCase implements CreatePost {
  constructor(private readonly findPetRepository: FindPetRepository) {}

  async execute(postDTO: CreatePostDTO): Promise<Post> {
    const pet = await this.findPetRepository.findById(postDTO.pet_id);

    if (!pet || pet.owner_id !== postDTO.author_id) {
      throw new AppError(
        "FORBIDDEN",
        "You do not have permission to create a post for this pet.",
      );
    }

    const post: Post = {
      id: "generated_post_id",
      pet_id: postDTO.pet_id,
      author_id: postDTO.author_id,
      caption: postDTO.caption,
      status: "PUBLISHED",
      created_at: new Date(),
    };
    return post;
  }
}
