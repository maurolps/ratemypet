import type {
  GetFeedInput,
  GetFeedQuery,
} from "@application/queries/get-feed.query";
import type { FeedItem } from "@domain/usecases/get-feed.contract";
import { PgPool } from "../helpers/pg-pool";
import { sql } from "../sql/feed.query.sql";

type FeedRow = {
  id: string;
  caption: string;
  image_url: string;
  pet_id: string;
  pet_name: string;
  pet_type: FeedItem["pet"]["type"];
  pet_ratings_count: number;
  author_id: string;
  author_name: string;
  likes_count: number;
  comments_count: number;
  viewer_has_liked: boolean;
  status: FeedItem["status"];
  created_at: Date;
};

export class PgFeedQuery implements GetFeedQuery {
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async getFeed(data: GetFeedInput): Promise<FeedItem[]> {
    const feedRows = await this.pool.query<FeedRow>(sql.FIND_FEED_ITEMS, [
      data.cursor?.created_at ?? null,
      data.cursor?.id ?? null,
      data.viewer_id ?? null,
      data.limit,
    ]);

    return feedRows.rows.map((feedRow) => ({
      id: feedRow.id,
      caption: feedRow.caption,
      image_url: feedRow.image_url,
      pet: {
        id: feedRow.pet_id,
        name: feedRow.pet_name,
        type: feedRow.pet_type,
        ratings_count: feedRow.pet_ratings_count,
      },
      author: {
        id: feedRow.author_id,
        name: feedRow.author_name,
      },
      likes_count: feedRow.likes_count,
      comments_count: feedRow.comments_count,
      viewer_has_liked: feedRow.viewer_has_liked,
      status: feedRow.status,
      created_at: feedRow.created_at,
    }));
  }
}
