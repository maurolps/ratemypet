import type {
  FindPostCommentsInput,
  GetCommentsQuery,
} from "@application/queries/get-post.query";
import type { GetPostComment } from "@domain/usecases/get-post.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetCommentsQueryStub implements GetCommentsQuery {
  async findCommentsByPostId(
    data: FindPostCommentsInput,
  ): Promise<GetPostComment[]> {
    return [
      {
        id: "valid_comment_id",
        post_id: data.post_id,
        author_id: "valid_author_id",
        author_name: "valid_author_name",
        content: "valid_comment_content",
        created_at: FIXED_DATE,
      },
    ];
  }
}
