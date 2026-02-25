import type { Post } from "@domain/entities/post";

export interface DeletePostRepository {
  deletePost(post: Post): Promise<void>;
}
