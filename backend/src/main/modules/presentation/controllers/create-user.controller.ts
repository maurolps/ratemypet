import type { CreateUser } from "../../domain/usecases/create-user";

type HttpRequest = {
  body: {
    name: string;
    email: string;
    password: string;
  };
};

type HttpResponse = {
  body?: {
    id: string;
    name: string;
    email: string;
  };
  error?: unknown;
  status: number;
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
    } catch (_) {
      return {
        error: new Error("Internal server error"),
        status: 500,
      };
    }
  }
}
