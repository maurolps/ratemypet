import type { GetProfileDTO } from "@domain/usecases/get-profile.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class GetProfileValidatorStub implements HttpValidator<GetProfileDTO> {
  execute(request: HttpRequest): GetProfileDTO {
    request.body = {
      user_id: "valid_user_id",
    };

    return request.body as GetProfileDTO;
  }
}
