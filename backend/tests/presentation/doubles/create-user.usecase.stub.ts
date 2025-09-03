import type { User } from "@domain/entities/user";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";

export class CreateUserStub implements CreateUser {
  async execute(user: CreateUserDTO): Promise<User> {
    return {
      id: "valid_id",
      name: user.name,
      email: user.email,
    };
  }
}
