import { AppError } from "@presentation/errors/app-error";
import type {
  CreateUser,
  CreateUserDTO,
} from "../../domain/usecases/create-user";
import type { HttpRequest } from "../dtos/http-request.dto";
import type { HttpResponse } from "../dtos/http-response.dto";
import { ErrorPresenter } from "../errors/error-presenter";
import { created } from "../http/http-helpers";
import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
  }),
});

class HttpValidator {
  constructor(private readonly schema: z.ZodType) {}
  execute(request: HttpRequest): CreateUserDTO {
    type Schema = z.infer<typeof createUserSchema>;

    const parsed = this.schema.safeParse(request);
    if (!parsed.success) {
      throw new AppError("MISSING_BODY");
    }

    const userDTO = (parsed.data as Schema).body;
    return userDTO;
  }
}

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
