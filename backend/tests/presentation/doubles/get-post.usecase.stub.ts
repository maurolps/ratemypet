import type {
  GetPost,
  GetPostDTO,
  GetPostResult,
} from "@domain/usecases/get-post.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetPostUseCaseStub implements GetPost {
  async execute(_: GetPostDTO): Promise<GetPostResult> {
    return {
      post: {
        id: "valid_post_id",
        pet_id: "valid_pet_id",
        author_id: "valid_author_id",
        caption: "valid_caption",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 2,
        comments_count: 1,
        viewer_has_liked: true,
      },
      comments: [
        {
          id: "valid_comment_id",
          post_id: "valid_post_id",
          author_id: "valid_comment_author_id",
          author_name: "valid_comment_author_name",
          content: "valid_comment_content",
          created_at: FIXED_DATE,
        },
      ],
      pagination: {
        limit: 20,
        next_cursor: null,
        has_more: false,
      },
    };
  }
}
