import type { DeleteRateDTO } from "@domain/usecases/delete-rate.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class DeleteRateValidatorStub implements HttpValidator<DeleteRateDTO> {
  execute(request: HttpRequest): DeleteRateDTO {
    request.body = {
      petId: "valid_pet_id",
      userId: "valid_user_id",
    };
    return request.body as DeleteRateDTO;
  }
}
