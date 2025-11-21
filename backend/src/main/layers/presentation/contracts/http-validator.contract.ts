import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export interface HttpValidator<T> {
  execute(request: HttpRequest): T;
}
