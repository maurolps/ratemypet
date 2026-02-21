import type {
  ListComments,
  ListCommentsDTO,
  ListCommentsResult,
} from "@domain/usecases/list-comments.contract";
import { FIXED_DATE } from "../../config/constants";

export class ListCommentsUseCaseStub implements ListComments {
  async execute(_: ListCommentsDTO): Promise<ListCommentsResult> {
    return {
      items: [
        {
          id: "valid_comment_id",
          post_id: "valid_post_id",
          author_id: "valid_author_id",
          author_name: "valid_author_name",
          content: "valid_comment_content",
          created_at: FIXED_DATE,
        },
      ],
      has_more: false,
      next_cursor: null,
    };
  }
}
