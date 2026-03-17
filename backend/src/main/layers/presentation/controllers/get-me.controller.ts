import type { GetMe, GetMeDTO } from "@domain/usecases/get-me.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class GetMeController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<GetMeDTO>,
    private readonly getMe: GetMe,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const getMeDTO = this.httpValidator.execute(request);
      const result = await this.getMe.execute(getMeDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
