import type {
  CreateComment,
  CreateCommentDTO,
  CreateCommentResult,
} from "@domain/usecases/create-comment.contract";
import { FIXED_DATE } from "../../config/constants";

export class CreateCommentUseCaseStub implements CreateComment {
  async execute(_: CreateCommentDTO): Promise<CreateCommentResult> {
    return {
      comment: {
        id: "valid_comment_id",
        post_id: "valid_post_id",
        author_id: "authenticated_user_id",
        content: "valid_comment_content",
        idempotency_key: "valid_idempotency_key",
        created_at: FIXED_DATE,
      },
      comments_count: 1,
    };
  }
}
