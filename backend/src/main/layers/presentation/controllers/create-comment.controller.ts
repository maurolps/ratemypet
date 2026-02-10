import type {
  CreateComment,
  CreateCommentDTO,
} from "@domain/usecases/create-comment.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class CreateCommentController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<CreateCommentDTO>,
    private readonly createComment: CreateComment,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const createCommentDTO = this.httpValidator.execute(request);
      const result = await this.createComment.execute(createCommentDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
