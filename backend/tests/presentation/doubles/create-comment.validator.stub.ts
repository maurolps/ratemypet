import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { CreateCommentDTO } from "@domain/usecases/create-comment.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class CreateCommentValidatorStub
  implements HttpValidator<CreateCommentDTO>
{
  execute(request: HttpRequest): CreateCommentDTO {
    request.body = {
      post_id: "valid_post_id",
      author_id: "authenticated_user_id",
      content: "valid_comment_content",
      idempotency_key: "valid_idempotency_key",
    };
    return request.body as CreateCommentDTO;
  }
}
