import { AppError } from "@application/errors/app-error";
import type {
  AuthenticatedUser,
  AuthenticateMiddleware,
} from "@presentation/contracts/middleware.contract";
import type { AccessTokenGenerator } from "@application/ports/token-generator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class AuthMiddleware implements AuthenticateMiddleware {
  constructor(private readonly tokenGenerator: AccessTokenGenerator) {}

  async handle(request: HttpRequest): Promise<AuthenticatedUser> {
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
      const { iat: _iat, exp: _exp, ...authenticatedUser } = accessTokenPayload;
      return authenticatedUser;
    } catch (_error) {
      throw new AppError("UNAUTHORIZED");
    }
  }
}
