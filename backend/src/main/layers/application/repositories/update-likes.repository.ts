import type { Post } from "@domain/entities/post";

export interface UpdateLikesRepository {
  updateLikesCount(post: Post): Promise<Post>;
}
