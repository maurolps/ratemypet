import type {
  GetPostDetails,
  GetPostQuery,
} from "@application/queries/get-post.query";
import { FIXED_DATE } from "../../config/constants";

export class GetPostQueryStub implements GetPostQuery {
  async findPostDetailsById(
    post_id: string,
    viewer_id?: string,
  ): Promise<GetPostDetails | null> {
    return {
      post: {
        id: post_id,
        pet_id: "valid_pet_id",
        author_id: "valid_author_id",
        caption: "valid_caption",
        status: "PUBLISHED",
        created_at: FIXED_DATE,
        likes_count: 1,
        comments_count: 1,
        viewer_has_liked: viewer_id === "valid_viewer_id",
      },
      ratings: {
        total_count: 4,
        by_rate: {
          cute: 1,
          funny: 1,
          majestic: 1,
          chaos: 0,
          smart: 1,
          sleepy: 0,
        },
      },
    };
  }
}
