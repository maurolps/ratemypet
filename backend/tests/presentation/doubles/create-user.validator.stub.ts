import type { CreateUserDTO } from "@domain/usecases/create-user";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class CreateUserValidatorStub implements HttpValidator {
  execute(request: HttpRequest): CreateUserDTO {
    request.body = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    } as CreateUserDTO;
    return request.body as CreateUserDTO;
  }
}
