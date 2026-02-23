import type {
  GetFeedInput,
  GetFeedQuery,
} from "@application/queries/get-feed.query";
import type { FeedItem } from "@domain/usecases/get-feed.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetFeedQueryStub implements GetFeedQuery {
  async getFeed(_: GetFeedInput): Promise<FeedItem[]> {
    return [
      {
        id: "valid_post_id",
        caption: "valid_caption",
        image_url: "valid_image_url.png",
        pet: {
          id: "valid_pet_id",
          name: "valid_pet_name",
          type: "dog",
        },
        author: {
          id: "valid_author_id",
          name: "valid_author_name",
        },
        likes_count: 2,
        comments_count: 1,
        viewer_has_liked: true,
        status: "PUBLISHED",
        created_at: FIXED_DATE,
      },
    ];
  }
}
