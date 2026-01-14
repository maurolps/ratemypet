import { AppError } from "@application/errors/app-error";
import type { Middleware } from "@presentation/contracts/middleware.contract";
import type { AccessTokenGenerator } from "@application/ports/token-generator.contract";
import type {
  AuthenticatedRequest,
  HttpRequest,
} from "@presentation/dtos/http-request.dto";

export class AuthMiddleware implements Middleware {
  constructor(private readonly tokenGenerator: AccessTokenGenerator) {}

  async handle(request: HttpRequest): Promise<AuthenticatedRequest> {
    const authHeader = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "MISSING_PARAM",
        "Authorization header is missing or malformed",
      );
    }

    const accessToken = authHeader.substring(7).trim();

    try {
      const accessTokenPayload = await this.tokenGenerator.verify(accessToken);
      const { iat: _iat, exp: _exp, ...user } = accessTokenPayload;
      return { user };
    } catch (_error) {
      throw new AppError("UNAUTHORIZED");
    }
  }
}
