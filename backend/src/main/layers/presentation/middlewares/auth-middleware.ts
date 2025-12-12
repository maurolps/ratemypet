import { AppError } from "@application/errors/app-error";
import type { Middleware } from "@presentation/contracts/middleware.contract";
import type {
  AuthenticatedRequest,
  HttpRequest,
} from "@presentation/dtos/http-request.dto";

export class AuthMiddleware implements Middleware {
  async handle(request: HttpRequest): Promise<AuthenticatedRequest> {
    const authHeader = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "MISSING_PARAM",
        "Authorization header is missing or malformed",
      );
    }
    return {
      user: {
        sub: "valid_user_id",
        name: "valid_name",
        email: "valid_email@example.com",
      },
    };
  }
}
