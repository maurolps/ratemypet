import type { HttpRequest } from "@presentation/dtos/http-request.dto";

interface LoginDTO {
  email: string;
  password: string;
}

export class LoginValidatorStub {
  execute(request: HttpRequest): LoginDTO {
    request.body = {
      email: "valid_email@mail.com",
      password: "valid_password",
    } as LoginDTO;
    return request.body as LoginDTO;
  }
}
