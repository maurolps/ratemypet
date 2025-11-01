import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";
import type { Controller } from "@presentation/contracts/controller.contract";
import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { HttpRequest } from "@presentation/dtos/http-request.dto";
import type { HttpResponse } from "@presentation/dtos/http-response.dto";
import { ErrorPresenter } from "@presentation/errors/error-presenter";
import { created } from "@presentation/http/http-helpers";

export class CreateUserController implements Controller {
  constructor(
    private readonly createUser: CreateUser,
    private readonly httpValidator: HttpValidator<CreateUserDTO>,
  ) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const userDTO = this.httpValidator.execute(request);

      const { name, email, password } = userDTO;
      const user = await this.createUser.execute({
        name,
        email,
        password,
      });
      return created(user);
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
