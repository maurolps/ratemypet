import type { User } from "@domain/entities/user";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";
import { AppError } from "@presentation/errors/app-error";

interface FindUserRepository {
  perform(email: string): Promise<User | null>;
}

export class CreateUserUseCase implements CreateUser {
  constructor(private readonly findUserByEmail: FindUserRepository) {}

  async execute(user: CreateUserDTO): Promise<User> {
    const userExists = await this.findUserByEmail.perform(user.email);

    if (userExists) {
      throw new AppError("EMAIL_TAKEN");
    }

    return {
      id: "any_id",
      name: user.name,
      email: user.email,
    };
  }
}
