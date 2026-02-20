import { AppError } from "@application/errors/app-error";
import type {
  AuthenticatedUser,
  AuthenticateMiddleware,
} from "@presentation/contracts/middleware.contract";
import type { AccessTokenGenerator } from "@application/ports/token-generator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export class AuthMiddleware implements AuthenticateMiddleware {
  constructor(
    private readonly tokenGenerator: AccessTokenGenerator,
    private readonly optional = false,
  ) {}

  async handle(request: HttpRequest): Promise<AuthenticatedUser | undefined> {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      if (this.optional) {
        return undefined;
      }

      throw new AppError(
        "MISSING_PARAM",
        "Authorization header is missing or malformed",
      );
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError(
        this.optional ? "UNAUTHORIZED" : "MISSING_PARAM",
        this.optional
          ? undefined
          : "Authorization header is missing or malformed",
      );
    }

    const accessToken = authHeader.substring(7).trim();
    if (!accessToken) {
      throw new AppError("UNAUTHORIZED");
    }

    try {
      const accessTokenPayload = await this.tokenGenerator.verify(accessToken);
      const { iat: _iat, exp: _exp, ...authenticatedUser } = accessTokenPayload;
      return authenticatedUser;
    } catch (_error) {
      throw new AppError("UNAUTHORIZED");
    }
  }
}
