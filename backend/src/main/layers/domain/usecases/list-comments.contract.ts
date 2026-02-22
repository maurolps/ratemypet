export type ListCommentItem = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: Date;
};

export type ListCommentsCursor = {
  created_at: Date;
  id: string;
};

export interface ListCommentsDTO {
  post_id: string;
  cursor?: ListCommentsCursor;
  limit: number;
}

export type ListCommentsResult = {
  items: ListCommentItem[];
  has_more: boolean;
  next_cursor: string | null;
};

export interface ListComments {
  execute(data: ListCommentsDTO): Promise<ListCommentsResult>;
}
