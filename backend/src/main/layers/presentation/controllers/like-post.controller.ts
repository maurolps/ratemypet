import type {
  LikePost,
  LikePostDTO,
} from "@domain/usecases/like-post.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class LikePostController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<LikePostDTO>,
    private readonly likePost: LikePost,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const likePostDTO = this.httpValidator.execute(request);
      const result = await this.likePost.execute(likePostDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
