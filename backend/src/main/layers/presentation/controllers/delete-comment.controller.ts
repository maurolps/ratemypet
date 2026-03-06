import type {
  DeleteComment,
  DeleteCommentDTO,
} from "@domain/usecases/delete-comment.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { noContent } from "@presentation/http/http-helpers";

export class DeleteCommentController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<DeleteCommentDTO>,
    private readonly deleteComment: DeleteComment,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const deleteCommentDTO = this.httpValidator.execute(request);
      await this.deleteComment.execute(deleteCommentDTO);
      return noContent();
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
