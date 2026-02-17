import type { GetPost, GetPostDTO } from "@domain/usecases/get-post.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class GetPostController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<GetPostDTO>,
    private readonly getPost: GetPost,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const getPostDTO = this.httpValidator.execute(request);
      const result = await this.getPost.execute(getPostDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
