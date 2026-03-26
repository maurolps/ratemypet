import type { RatePet, RatePetDTO } from "@domain/usecases/rate-pet.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class RatePetController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<RatePetDTO>,
    private readonly ratePet: RatePet,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const ratePetDTO = this.httpValidator.execute(request);
      const result = await this.ratePet.execute(ratePetDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
