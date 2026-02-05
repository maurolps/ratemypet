import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Post } from "@domain/entities/post";

export interface UpdateLikesRepository {
  incrementLikesCount(post: Post, transaction?: Transaction): Promise<Post>;
  decrementLikesCount(post: Post, transaction?: Transaction): Promise<Post>;
}
