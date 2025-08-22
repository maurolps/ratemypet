import type { User } from "../../../src/main/modules/domain/entities/user";
import type {
  CreateUser,
  CreateUserDTO,
} from "../../../src/main/modules/domain/usecases/create-user";

export class CreateUserStub implements CreateUser {
  async execute(user: CreateUserDTO): Promise<User> {
    return {
      id: "valid_id",
      name: user.name,
      email: user.email,
    };
  }
}
