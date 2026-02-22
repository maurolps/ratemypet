import type { FeedCursor, FeedItem } from "@domain/usecases/get-feed.contract";

export type GetFeedInput = {
  viewer_id?: string;
  cursor?: FeedCursor;
  limit: number;
};

export interface GetFeedQuery {
  getFeed(data: GetFeedInput): Promise<FeedItem[]>;
}
