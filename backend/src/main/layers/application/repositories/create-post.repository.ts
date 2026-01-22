import type { Post } from "@domain/entities/post";
import type { CreatePostDTO } from "@domain/usecases/create-post.contract";

export interface CreatePostRepository {
  create(postDTO: CreatePostDTO): Promise<Post>;
}
