import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { LoginDTO } from "@domain/usecases/login.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";

export class LoginValidatorStub implements HttpValidator<LoginDTO> {
  execute(request: HttpRequest): LoginDTO {
    request.body = {
      email: "valid_email@mail.com",
      password: "valid_password",
    } as LoginDTO;
    return request.body as LoginDTO;
  }
}
