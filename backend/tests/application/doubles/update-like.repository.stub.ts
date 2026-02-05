import type { UpdateLikesRepository } from "@application/repositories/update-likes.repository";
import { Post } from "@domain/entities/post";
import { FIXED_DATE } from "../../config/constants";

export class UpdateLikesRepositoryStub implements UpdateLikesRepository {
  async updateLikesCount(post: Post): Promise<Post> {
    const state = post.toState;

    return Post.rehydrate({
      ...state,
      id: state.id ?? "valid_post_id",
      created_at: FIXED_DATE,
    });
  }

  async decrementLikesCount(post: Post): Promise<Post> {
    const state = post.toState;

    return Post.rehydrate({
      ...state,
      id: state.id ?? "valid_post_id",
      created_at: FIXED_DATE,
    });
  }
}
