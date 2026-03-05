import type {
  DeletePet,
  DeletePetDTO,
} from "@domain/usecases/delete-pet.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { noContent } from "@presentation/http/http-helpers";

export class DeletePetController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<DeletePetDTO>,
    private readonly deletePet: DeletePet,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const deletePetDTO = this.httpValidator.execute(request);
      await this.deletePet.execute(deletePetDTO);
      return noContent();
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
