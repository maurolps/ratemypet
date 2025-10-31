import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ok } from "@presentation/http/http-helpers";

export class LoginController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return ok(`Login successful: ${request.body}`);
  }
}
