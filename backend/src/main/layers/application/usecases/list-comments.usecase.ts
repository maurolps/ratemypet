import { AppError } from "@application/errors/app-error";
import type { GetCommentsQuery } from "@application/queries/get-comments.query";
import type { PostExistsQuery } from "@application/queries/post-exists.query";
import type {
  ListCommentItem,
  ListComments,
  ListCommentsDTO,
  ListCommentsResult,
} from "@domain/usecases/list-comments.contract";

export class ListCommentsUseCase implements ListComments {
  constructor(
    private readonly postExistsQuery: PostExistsQuery,
    private readonly getCommentsQuery: GetCommentsQuery,
  ) {}

  async execute(data: ListCommentsDTO): Promise<ListCommentsResult> {
    const postExists = await this.postExistsQuery.existsById(data.post_id);

    if (!postExists) {
      throw new AppError("NOT_FOUND", "The specified post does not exist.");
    }

    const comments = await this.getCommentsQuery.findCommentsByPostId({
      post_id: data.post_id,
      limit: data.limit + 1,
      cursor: data.cursor,
    });

    const hasMore = comments.length > data.limit;
    const paginatedComments = hasMore
      ? comments.slice(0, data.limit)
      : comments;
    const nextCursor = hasMore
      ? this.encodeCursor(paginatedComments[paginatedComments.length - 1])
      : null;

    return {
      items: paginatedComments,
      has_more: hasMore,
      next_cursor: nextCursor,
    };
  }

  private encodeCursor(comment: ListCommentItem): string {
    const commentDate = new Date(comment.created_at);
    return `${commentDate.toISOString()}|${comment.id}`;
  }
}
