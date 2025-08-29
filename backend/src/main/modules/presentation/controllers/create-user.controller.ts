import { HttpValidator } from "@presentation/validation/http-validator";
import type { CreateUser } from "../../domain/usecases/create-user";
import type { HttpRequest } from "../dtos/http-request.dto";
import type { HttpResponse } from "../dtos/http-response.dto";
import { ErrorPresenter } from "../errors/error-presenter";
import { created } from "../http/http-helpers";
import { createUserSchema } from "@presentation/validation/create-user.schema";

export class CreateUserController {
  constructor(private readonly createUser: CreateUser) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const httpValidator = new HttpValidator(createUserSchema);
      const userDTO = httpValidator.execute(request);

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
