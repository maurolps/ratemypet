import type { CreatePostRepository } from "@application/repositories/create-post.repository";
import { Post } from "@domain/entities/post";
import { FIXED_DATE } from "../../config/constants";

export class CreatePostRepositoryStub implements CreatePostRepository {
  async save(post: Post): Promise<Post> {
    const state = post.toState;

    return Post.rehydrate({
      id: "valid_post_id",
      pet_id: state.pet_id,
      author_id: state.author_id,
      caption: state.caption,
      status: state.status,
      created_at: FIXED_DATE,
      likes_count: state.likes_count,
      comments_count: state.comments_count,
    });
  }
}
