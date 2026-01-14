import type {
  UploadPet,
  UploadPetDTO,
} from "@domain/usecases/upload-pet.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class UploadPetController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<UploadPetDTO>,
    private readonly uploadPet: UploadPet,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const petDTO = this.httpValidator.execute(request);

      const pet = await this.uploadPet.execute(petDTO);

      return ok(pet);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
