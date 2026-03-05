import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Post } from "@domain/entities/post";

export interface DeletePostRepository {
  deletePost(post: Post, transaction?: Transaction): Promise<void>;
}
