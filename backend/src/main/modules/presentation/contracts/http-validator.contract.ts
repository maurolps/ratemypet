import type { CreateUserDTO } from "@domain/usecases/create-user.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";

export interface HttpValidator {
  execute(request: HttpRequest): CreateUserDTO;
}
