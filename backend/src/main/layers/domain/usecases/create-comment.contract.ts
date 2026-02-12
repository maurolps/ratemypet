import type { Comment } from "@domain/entities/comment";

export interface CreateCommentDTO {
  post_id: string;
  author_id: string;
  content: string;
  idempotency_key: string;
}

export type CreateCommentResult = {
  comment: Comment;
  comments_count: number;
};

export interface CreateComment {
  execute(data: CreateCommentDTO): Promise<CreateCommentResult>;
}
