import type {
  ListComments,
  ListCommentsDTO,
} from "@domain/usecases/list-comments.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class ListCommentsController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<ListCommentsDTO>,
    private readonly listComments: ListComments,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const listCommentsDTO = this.httpValidator.execute(request);
      const result = await this.listComments.execute(listCommentsDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
