import { FIXED_DATE } from "../../config/constants";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { CreateUserData } from "@application/repositories/create-user.repository";
import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type { User } from "@domain/entities/user";

export class CreateUserRepositoryStub implements CreateUserRepository {
  create(userDTO: CreateUserData, _transaction?: Transaction): Promise<User> {
    return new Promise((resolve) => {
      resolve({
        id: "any_id",
        created_at: FIXED_DATE,
        name: userDTO.name,
        email: userDTO.email,
      });
    });
  }
}
