import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";

export interface Controller {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
