import type {
  CreatePost,
  CreatePostDTO,
} from "@domain/usecases/create-post.contract";
import type { Post } from "@domain/entities/post";
import type { FindPetRepository } from "@application/repositories/find-pet.repository";

export class CreatePostUseCase implements CreatePost {
  constructor(private readonly findPetRepository: FindPetRepository) {}

  async execute(postDTO: CreatePostDTO): Promise<Post> {
    await this.findPetRepository.findById(postDTO.pet_id);
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
