import type { GetFeed, GetFeedDTO } from "@domain/usecases/get-feed.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class GetFeedController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<GetFeedDTO>,
    private readonly getFeed: GetFeed,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const getFeedDTO = this.httpValidator.execute(request);
      const result = await this.getFeed.execute(getFeedDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
