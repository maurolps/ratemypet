import type { GetPostQuery } from "@application/queries/get-post.query";
import type {
  FindPostCommentsInput,
  GetCommentsQuery,
} from "@application/queries/get-comments.query";
import type {
  GetPostComment,
  GetPostData,
} from "@domain/usecases/get-post.contract";
import { PgPool } from "../helpers/pg-pool";
import { sql } from "../sql/post.query.sql";

type PostDetailsRow = {
  id: string;
  pet_id: string;
  author_id: string;
  caption: string;
  status: GetPostData["status"];
  created_at: Date;
  likes_count: number;
  comments_count: number;
  viewer_has_liked: boolean;
};

type PostCommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: Date;
};

export class PgPostQuery implements GetPostQuery, GetCommentsQuery {
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async findPostDetailsById(
    post_id: string,
    viewer_id?: string,
  ): Promise<GetPostData | null> {
    const postRows = await this.pool.query<PostDetailsRow>(
      sql.FIND_POST_DETAILS_BY_ID,
      [post_id, viewer_id ?? null],
    );
    const post = postRows.rows[0] || null;

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      pet_id: post.pet_id,
      author_id: post.author_id,
      caption: post.caption,
      status: post.status,
      created_at: post.created_at,
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      viewer_has_liked: post.viewer_has_liked,
    };
  }

  async findCommentsByPostId(
    data: FindPostCommentsInput,
  ): Promise<GetPostComment[]> {
    const commentRows = await this.pool.query<PostCommentRow>(
      sql.FIND_POST_COMMENTS,
      [
        data.post_id,
        data.cursor?.created_at ?? null,
        data.cursor?.id ?? null,
        data.limit,
      ],
    );

    return commentRows.rows;
  }
}
