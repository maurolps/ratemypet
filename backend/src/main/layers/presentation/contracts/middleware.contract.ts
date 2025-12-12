import type {
  AuthenticatedRequest,
  HttpRequest,
} from "@presentation/dtos/http-request.dto";

export interface Middleware {
  handle(request: HttpRequest): Promise<AuthenticatedRequest>;
}
