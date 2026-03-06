import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { DeleteCommentDTO } from "@domain/usecases/delete-comment.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class DeleteCommentValidatorStub
  implements HttpValidator<DeleteCommentDTO>
{
  execute(request: HttpRequest): DeleteCommentDTO {
    request.body = {
      post_id: "valid_post_id",
      comment_id: "valid_comment_id",
      user_id: "authenticated_user_id",
    };
    return request.body as DeleteCommentDTO;
  }
}
