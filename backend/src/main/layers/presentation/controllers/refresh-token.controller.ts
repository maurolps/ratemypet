import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";

export class RefreshTokenController implements Controller {
  async handle(_request: HttpRequest): Promise<HttpResponse> {
    return { status: 200, body: {} };
  }
}
