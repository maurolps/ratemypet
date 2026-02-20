import type { GetPostComment } from "@domain/usecases/get-post.contract";

export type CommentsCursor = {
  created_at: Date;
  id: string;
};

export type FindPostCommentsInput = {
  post_id: string;
  limit: number;
  cursor?: CommentsCursor;
};

export interface GetCommentsQuery {
  findCommentsByPostId(data: FindPostCommentsInput): Promise<GetPostComment[]>;
}
