import type {
  GetPostDetails,
  GetPostQuery,
} from "@application/queries/get-post.query";
import type {
  FindPostCommentsInput,
  GetCommentsQuery,
} from "@application/queries/get-comments.query";
import type { PostExistsQuery } from "@application/queries/post-exists.query";
import type {
  GetPostComment,
  GetPostData,
  GetPostRatings,
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
  ratings_total_count: number;
  cute_count: number;
  funny_count: number;
  majestic_count: number;
  chaos_count: number;
  smart_count: number;
  sleepy_count: number;
};

type PostCommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: Date;
};

type PostExistsRow = {
  post_exists: boolean;
};

export class PgPostQuery
  implements GetPostQuery, GetCommentsQuery, PostExistsQuery
{
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async existsById(post_id: string): Promise<boolean> {
    const postRows = await this.pool.query<PostExistsRow>(
      sql.POST_EXISTS_BY_ID,
      [post_id],
    );

    return postRows.rows[0].post_exists;
  }

  async findPostDetailsById(
    post_id: string,
    viewer_id?: string,
  ): Promise<GetPostDetails | null> {
    const postRows = await this.pool.query<PostDetailsRow>(
      sql.FIND_POST_DETAILS_BY_ID,
      [post_id, viewer_id ?? null],
    );
    const post = postRows.rows[0] || null;

    if (!post) {
      return null;
    }

    const ratings: GetPostRatings = {
      total_count: post.ratings_total_count,
      by_rate: {
        cute: post.cute_count,
        funny: post.funny_count,
        majestic: post.majestic_count,
        chaos: post.chaos_count,
        smart: post.smart_count,
        sleepy: post.sleepy_count,
      },
    };

    return {
      post: {
        id: post.id,
        pet_id: post.pet_id,
        author_id: post.author_id,
        caption: post.caption,
        status: post.status,
        created_at: post.created_at,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        viewer_has_liked: post.viewer_has_liked,
      },
      ratings,
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
