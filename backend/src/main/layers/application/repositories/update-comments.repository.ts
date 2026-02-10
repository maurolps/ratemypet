import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Post } from "@domain/entities/post";

export interface UpdateCommentsRepository {
  incrementCommentsCount(post: Post, transaction?: Transaction): Promise<Post>;
}
