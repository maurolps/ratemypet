import type { Post } from "@domain/entities/post";
export interface CreatePostRepository {
  save(post: Post): Promise<Post>;
}
