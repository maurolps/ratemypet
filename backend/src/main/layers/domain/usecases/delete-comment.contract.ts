export interface DeleteCommentDTO {
  post_id: string;
  comment_id: string;
  user_id: string;
}

export interface DeleteComment {
  execute(data: DeleteCommentDTO): Promise<void>;
}
