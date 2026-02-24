import type { GetFeedQuery } from "@application/queries/get-feed.query";
import type {
  FeedItem,
  GetFeed,
  GetFeedDTO,
  GetFeedResult,
} from "@domain/usecases/get-feed.contract";

export class GetFeedUseCase implements GetFeed {
  constructor(private readonly getFeedQuery: GetFeedQuery) {}

  async execute(data: GetFeedDTO): Promise<GetFeedResult> {
    const items = await this.getFeedQuery.getFeed({
      viewer_id: data.viewer_id,
      cursor: data.cursor,
      limit: data.limit + 1,
    });

    const hasMore = items.length > data.limit;
    const paginatedItems = hasMore ? items.slice(0, data.limit) : items;
    const nextCursor = hasMore
      ? this.encodeCursor(paginatedItems[paginatedItems.length - 1])
      : null;

    return {
      items: paginatedItems,
      has_more: hasMore,
      next_cursor: nextCursor,
    };
  }

  private encodeCursor(feedItem: FeedItem): string {
    const feedItemDate = new Date(feedItem.created_at);
    return `${feedItemDate.toISOString()}|${feedItem.id}`;
  }
}
