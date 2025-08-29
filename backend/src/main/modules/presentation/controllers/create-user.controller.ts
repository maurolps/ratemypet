import type { HttpValidator } from "@presentation/contracts/http-validator.contract";
import type { CreateUser } from "../../domain/usecases/create-user";
import type { HttpRequest } from "../dtos/http-request.dto";
import type { HttpResponse } from "../dtos/http-response.dto";
import { ErrorPresenter } from "../errors/error-presenter";
import { created } from "../http/http-helpers";

export class CreateUserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly httpValidator: HttpValidator,
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
