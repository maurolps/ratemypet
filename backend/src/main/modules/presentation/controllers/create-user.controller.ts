import type { CreateUser } from "../../domain/usecases/create-user";
import type { HttpRequest } from "../dtos/http-request.dto";
import type { HttpResponse } from "../dtos/http-response.dto";
import { ErrorPresenter } from "../errors/error-presenter";

export class CreateUserController {
  constructor(private readonly createUser: CreateUser) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = request.body;
      const user = await this.createUser.execute({
        name,
        email,
        password,
      });
      return {
        body: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        status: 201,
      };
    } catch (error) {
      return ErrorPresenter(error);
    }
  }
}
