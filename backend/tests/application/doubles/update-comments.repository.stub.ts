import type { UpdateCommentsRepository } from "@application/repositories/update-comments.repository";
import { Post } from "@domain/entities/post";
import { FIXED_DATE } from "../../config/constants";

export class UpdateCommentsRepositoryStub implements UpdateCommentsRepository {
  async incrementCommentsCount(post: Post): Promise<Post> {
    const state = post.toState;

    return Post.rehydrate({
      ...state,
      id: state.id ?? "valid_post_id",
      created_at: FIXED_DATE,
    });
  }
}
