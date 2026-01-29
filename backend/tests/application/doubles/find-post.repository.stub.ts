import type { FindPostRepository } from "@application/repositories/find-post.repository";
import { Post } from "@domain/entities/post";
import { FIXED_DATE } from "../../config/constants";

export class FindPostRepositoryStub implements FindPostRepository {
  async findById(postId: string): Promise<Post | null> {
    return Post.rehydrate({
      id: postId,
      pet_id: "valid_pet_id",
      author_id: "valid_author_id",
      caption: "valid_caption",
      status: "PUBLISHED",
      created_at: FIXED_DATE,
      likes_count: 0,
      comments_count: 0,
    });
  }
}
