import type {
  DeleteRate,
  DeleteRateDTO,
} from "@domain/usecases/delete-rate.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class DeleteRateController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<DeleteRateDTO>,
    private readonly deleteRate: DeleteRate,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const deleteRateDTO = this.httpValidator.execute(request);
      const result = await this.deleteRate.execute(deleteRateDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
