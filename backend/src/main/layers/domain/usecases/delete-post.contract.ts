export interface DeletePostDTO {
  post_id: string;
  user_id: string;
}

export interface DeletePost {
  execute(data: DeletePostDTO): Promise<void>;
}
