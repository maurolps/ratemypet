import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";

export class RefreshTokenController implements Controller {
  constructor(
    private readonly httpValidator: HttpValidator<RefreshTokenParsed>,
    private readonly refreshToken: RefreshToken,
  ) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const parsedToken = this.httpValidator.execute(request);
      const _tokens = await this.refreshToken.execute(parsedToken);
      return { status: 200, body: {} };
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
