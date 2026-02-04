import type { Like } from "@domain/entities/like";

export interface LikePostDTO {
  post_id: string;
  user_id: string;
}

export type LikePostResult = {
  like: Like;
  likes_count: number;
};

export interface LikePost {
  execute(data: LikePostDTO): Promise<LikePostResult>;
}
