import type { DeletePetDTO } from "@domain/usecases/delete-pet.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class DeletePetValidatorStub implements HttpValidator<DeletePetDTO> {
  execute(request: HttpRequest): DeletePetDTO {
    request.body = {
      pet_id: "valid_pet_id",
      user_id: "authenticated_user_id",
    };
    return request.body as DeletePetDTO;
  }
}
