import type {
  UpdateProfile,
  UpdateProfileDTO,
} from "@domain/usecases/update-profile.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class UpdateProfileController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<UpdateProfileDTO>,
    private readonly updateProfile: UpdateProfile,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const updateProfileDTO = this.httpValidator.execute(request);
      const result = await this.updateProfile.execute(updateProfileDTO);
      return ok(result);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
