import type { User } from "@domain/entities/user";
import type { CreateUserDTO } from "@domain/usecases/create-user.contract";

export interface CreateUserRepository {
  create(userDTO: CreateUserDTO): Promise<User>;
}
