import { isDomainError } from "../../domain/errors/domain-error";
import type { CreateUser } from "../../domain/usecases/create-user";
import type { HttpRequest } from "../dtos/http-request.dto";
import type { HttpResponse } from "../dtos/http-response.dto";

const ErrorPresenter = (err: unknown): HttpResponse => {
  if (isDomainError(err)) {
    switch (err.code) {
      case "EMAIL_TAKEN":
        return { error: "Email already in use", status: 409 };
    }
  }
  return { error: "Internal server error", status: 500 };
};

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
