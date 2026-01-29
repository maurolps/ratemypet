import type { UpdatePostRepository } from "@application/repositories/update-post.repository";
import { Post } from "@domain/entities/post";
import { FIXED_DATE } from "../../config/constants";

export class UpdatePostRepositoryStub implements UpdatePostRepository {
  async update(post: Post): Promise<Post> {
    const state = post.toState;

    return Post.rehydrate({
      ...state,
      id: state.id ?? "valid_post_id",
      created_at: FIXED_DATE,
    });
  }
}
