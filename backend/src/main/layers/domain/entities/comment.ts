export type Comment = {
  id?: string;
  post_id: string;
  author_id: string;
  content: string;
  idempotency_key: string;
  created_at?: Date;
};
