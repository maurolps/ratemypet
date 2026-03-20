import type {
  GetProfile,
  GetProfileDTO,
} from "@domain/usecases/get-profile.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class GetProfileController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<GetProfileDTO>,
    private readonly getProfile: GetProfile,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const getProfileDTO = this.httpValidator.execute(request);
      const result = await this.getProfile.execute(getProfileDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
