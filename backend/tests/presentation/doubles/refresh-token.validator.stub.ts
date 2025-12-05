import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { RefreshTokenParsed } from "@domain/usecases/refresh-token.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class RefreshTokenValidatorStub
  implements HttpValidator<RefreshTokenParsed>
{
  execute(request: HttpRequest): RefreshTokenParsed {
    request.body = {
      id: "valid_id",
      secret: "valid_secret",
    };
    return request.body as RefreshTokenParsed;
  }
}
