import type { RatePetDTO } from "@domain/usecases/rate-pet.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class RatePetValidatorStub implements HttpValidator<RatePetDTO> {
  execute(request: HttpRequest): RatePetDTO {
    request.body = {
      petId: "valid_pet_id",
      userId: "valid_user_id",
      rate: "majestic",
    };
    return request.body as RatePetDTO;
  }
}
