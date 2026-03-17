import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { User } from "@domain/entities/user";

export type CreateUserData = {
  name: string;
  email: string;
  picture?: string | null;
  display_name: string;
  bio: string;
};

export interface CreateUserRepository {
  create(userDTO: CreateUserData, transaction?: Transaction): Promise<User>;
}
