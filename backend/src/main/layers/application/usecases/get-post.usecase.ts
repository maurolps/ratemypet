import { AppError } from "@application/errors/app-error";
import type { GetPostQuery } from "@application/queries/get-post.query";
import type { GetCommentsQuery } from "@application/queries/get-comments.query";
import type {
  GetPost,
  GetPostComment,
  GetPostDTO,
  GetPostResult,
} from "@domain/usecases/get-post.contract";

export class GetPostUseCase implements GetPost {
  constructor(
    private readonly getPostQuery: GetPostQuery,
    private readonly getCommentsQuery: GetCommentsQuery,
  ) {}

  async execute(data: GetPostDTO): Promise<GetPostResult> {
    const commentsLimit = data.limit;
    const commentsCursor = data.cursor;

    const post = await this.getPostQuery.findPostDetailsById(
      data.post_id,
      data.viewer_id,
    );

    if (!post) {
      throw new AppError("NOT_FOUND", "The specified post does not exist.");
    }

    const comments = await this.getCommentsQuery.findCommentsByPostId({
      post_id: data.post_id,
      limit: commentsLimit + 1,
      cursor: commentsCursor,
    });

    const hasMore = comments.length > commentsLimit;
    const paginatedComments = hasMore
      ? comments.slice(0, commentsLimit)
      : comments;
    const nextCursor = hasMore
      ? this.encodeCursor(paginatedComments[paginatedComments.length - 1])
      : null;

    return {
      post,
      comments: paginatedComments,
      pagination: {
        limit: commentsLimit,
        next_cursor: nextCursor,
        has_more: hasMore,
      },
    };
  }

  private encodeCursor(comment: GetPostComment): string {
    const commentDate = new Date(comment.created_at);
    return `${commentDate.toISOString()}|${comment.id}`;
  }
}
