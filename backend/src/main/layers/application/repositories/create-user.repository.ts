import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { User } from "@domain/entities/user";

export type CreateUserData = Pick<User, "name" | "email" | "picture">;

export interface CreateUserRepository {
  create(userDTO: CreateUserData, transaction?: Transaction): Promise<User>;
}
