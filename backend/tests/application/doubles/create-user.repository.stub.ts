import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type { User } from "@domain/entities/user";
import type { CreateUserDTO } from "@domain/usecases/create-user.contract";

export class CreateUserRepositoryStub implements CreateUserRepository {
  perform(userDTO: CreateUserDTO): Promise<User> {
    return new Promise((resolve) => {
      resolve({ id: "any_id", ...userDTO });
    });
  }
}
