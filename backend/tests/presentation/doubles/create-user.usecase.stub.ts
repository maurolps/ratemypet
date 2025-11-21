import { FIXED_DATE } from "../../config/constants";
import type { User } from "@domain/entities/user";
import type {
  CreateUser,
  CreateUserDTO,
} from "@domain/usecases/create-user.contract";

export class CreateUserStub implements CreateUser {
  async execute(user: CreateUserDTO): Promise<User> {
    return {
      id: "valid_id",
      created_at: FIXED_DATE,
      name: user.name,
      email: user.email,
    };
  }
}
