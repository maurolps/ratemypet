import type { Login, LoginDTO } from "@domain/usecases/login.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

export class LoginController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<LoginDTO>,
    private readonly login: Login,
  ) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const loginDTO = this.httpValidator.execute(request);
      const authData = await this.login.auth(loginDTO);
      return ok({ tokens: authData });
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
