export interface UnlikePostDTO {
  post_id: string;
  user_id: string;
}

export type UnlikePostResult = {
  post_id: string;
  likes_count: number;
};

export interface UnlikePost {
  execute(data: UnlikePostDTO): Promise<UnlikePostResult>;
}
