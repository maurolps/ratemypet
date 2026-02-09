import type {
  UnlikePost,
  UnlikePostDTO,
  UnlikePostResult,
} from "@domain/usecases/unlike-post.contract";

export class UnlikePostUseCaseStub implements UnlikePost {
  async execute(_: UnlikePostDTO): Promise<UnlikePostResult> {
    return {
      post_id: "valid_post_id",
      likes_count: 0,
    };
  }
}
