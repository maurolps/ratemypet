import type { PostStatus } from "@domain/entities/post";

export type GetPostComment = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: Date;
};

export type GetPostData = {
  id: string;
  pet_id: string;
  author_id: string;
  caption: string;
  status: PostStatus;
  created_at: Date;
  likes_count: number;
  comments_count: number;
  viewer_has_liked: boolean;
};

export type GetPostRatings = {
  total_count: number;
  by_rate: {
    cute: number;
    funny: number;
    majestic: number;
    chaos: number;
    smart: number;
    sleepy: number;
  };
};

export interface GetPostDTO {
  post_id: string;
  viewer_id?: string;
  cursor?: { created_at: Date; id: string };
  limit: number;
}

export type GetPostResult = {
  post: GetPostData;
  ratings: GetPostRatings;
  comments: GetPostComment[];
  pagination: {
    limit: number;
    next_cursor: string | null;
    has_more: boolean;
  };
};

export interface GetPost {
  execute(data: GetPostDTO): Promise<GetPostResult>;
}
