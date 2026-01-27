import { Post } from "@domain/entities/post";
import type {
  CreatePost,
  CreatePostDTO,
} from "@domain/usecases/create-post.contract";
import { FIXED_DATE } from "../../config/constants";

export class CreatePostUseCaseStub implements CreatePost {
  async execute(postDTO: CreatePostDTO): Promise<Post> {
    return Post.create({
      id: "valid_post_id",
      pet_id: postDTO.pet_id,
      author_id: postDTO.author_id,
      caption: postDTO.caption,
      default_caption: "This is a default caption for the pet",
      created_at: FIXED_DATE,
    });
  }
}
