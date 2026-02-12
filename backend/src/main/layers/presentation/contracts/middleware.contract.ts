import type { AccessTokenPayload } from "@domain/entities/token";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export type AuthenticatedUser = Omit<AccessTokenPayload, "iat" | "exp">;

export interface AuthenticateMiddleware {
  handle(request: HttpRequest): Promise<AuthenticatedUser>;
}
