import { PgPool } from "@infra/db/postgres/helpers/pg-pool";

type InsertCommentDTO = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  idempotency_key: string;
  created_at: Date;
};

export const insertComment = async (
  comment: InsertCommentDTO,
): Promise<void> => {
  const pool = PgPool.getInstance();
  await pool.query(
    `
    INSERT INTO comments (id, post_id, author_id, content, idempotency_key, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      comment.id,
      comment.post_id,
      comment.author_id,
      comment.content,
      comment.idempotency_key,
      comment.created_at,
    ],
  );
};
