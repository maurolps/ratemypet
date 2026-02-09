import type {
  UnlikePost,
  UnlikePostDTO,
} from "@domain/usecases/unlike-post.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class UnlikePostController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<UnlikePostDTO>,
    private readonly unlikePost: UnlikePost,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const unlikePostDTO = this.httpValidator.execute(request);
      const result = await this.unlikePost.execute(unlikePostDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
