import type { Post } from "@domain/entities/post";

export interface FindPostRepository {
  findById(postId: string): Promise<Post | null>;
}
