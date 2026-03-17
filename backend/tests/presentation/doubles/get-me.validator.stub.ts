import type { GetMeDTO } from "@domain/usecases/get-me.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class GetMeValidatorStub implements HttpValidator<GetMeDTO> {
  execute(request: HttpRequest): GetMeDTO {
    request.body = {
      user_id: "valid_user_id",
    };

    return request.body as GetMeDTO;
  }
}
