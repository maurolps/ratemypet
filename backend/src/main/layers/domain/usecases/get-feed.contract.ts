import type { PetType } from "@domain/entities/pet";
import type { PostStatus } from "@domain/entities/post";

export type FeedCursor = {
  created_at: Date;
  id: string;
};

export type FeedItem = {
  id: string;
  caption: string;
  image_url: string;
  pet: {
    id: string;
    name: string;
    type: PetType;
  };
  author: {
    id: string;
    name: string;
  };
  likes_count: number;
  comments_count: number;
  viewer_has_liked: boolean;
  status: PostStatus;
  created_at: Date;
};

export interface GetFeedDTO {
  viewer_id?: string;
  cursor?: FeedCursor;
  limit: number;
}

export type GetFeedResult = {
  items: FeedItem[];
  has_more: boolean;
  next_cursor: string | null;
};

export interface GetFeed {
  execute(data: GetFeedDTO): Promise<GetFeedResult>;
}
