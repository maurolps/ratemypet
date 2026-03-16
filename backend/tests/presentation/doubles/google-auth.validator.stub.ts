import type { GoogleAuthDTO } from "@domain/usecases/google-auth.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class GoogleAuthValidatorStub implements HttpValidator<GoogleAuthDTO> {
  execute(_request: HttpRequest): GoogleAuthDTO {
    return {
      id_token: "valid_google_id_token",
    };
  }
}
