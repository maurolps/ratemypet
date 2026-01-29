import type { Post } from "@domain/entities/post";

export interface UpdatePostRepository {
  update(post: Post): Promise<Post>;
}
