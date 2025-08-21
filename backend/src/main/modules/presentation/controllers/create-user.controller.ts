import type { CreateUser } from "../../domain/usecases/create-user";

type HttpRequest = {
  body: {
    name: string;
    email: string;
    password: string;
  };
};

type HttpResponse = {
  body: {
    id: string;
    name: string;
    email: string;
  };
  status: number;
};

export class CreateUserController {
  constructor(private readonly createUser: CreateUser) {}
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { name, email, password } = request.body;
    const createdUser = await this.createUser.execute({
      name,
      email,
      password,
    });
    return {
      body: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      },
      status: 201,
    };
  }
}
