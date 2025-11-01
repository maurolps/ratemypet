import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { ok } from "@presentation/http/http-helpers";

interface LoginHttpValidator {
  execute(request: HttpRequest): { email: string; password: string };
}

export class LoginController implements Controller {
  constructor(private readonly httpValidator: LoginHttpValidator) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const loginDTO = this.httpValidator.execute(request);
      return ok(`Login successful: ${loginDTO}`);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
