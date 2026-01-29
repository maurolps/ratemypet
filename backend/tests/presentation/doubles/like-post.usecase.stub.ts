import type {
  LikePost,
  LikePostDTO,
  LikePostResult,
} from "@domain/usecases/like-post.contract";
import { FIXED_DATE } from "../../config/constants";

export class LikePostUseCaseStub implements LikePost {
  async execute(_: LikePostDTO): Promise<LikePostResult> {
    return {
      like: {
        post_id: "valid_post_id",
        user_id: "valid_user_id",
        created_at: FIXED_DATE,
      },
      likes_count: 1,
    };
  }
}
