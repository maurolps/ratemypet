import type {
  DeletePost,
  DeletePostDTO,
} from "@domain/usecases/delete-post.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { noContent } from "@presentation/http/http-helpers";

export class DeletePostController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<DeletePostDTO>,
    private readonly deletePost: DeletePost,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const deletePostDTO = this.httpValidator.execute(request);
      await this.deletePost.execute(deletePostDTO);
      return noContent();
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
