import type { CreatePostRepository } from "@application/repositories/create-post.repository";
import type { CreatePostDTO } from "@domain/usecases/create-post.contract";
import type { Post } from "@domain/entities/post";
import { FIXED_DATE } from "../../config/constants";

export class CreatePostRepositoryStub implements CreatePostRepository {
  async create(postDTO: CreatePostDTO): Promise<Post> {
    return {
      id: "valid_post_id",
      pet_id: postDTO.pet_id,
      author_id: postDTO.author_id,
      caption: postDTO.caption,
      status: "PUBLISHED",
      created_at: FIXED_DATE,
    };
  }
}
