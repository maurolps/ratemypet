import { FIXED_DATE } from "../../config/constants";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { User } from "@domain/entities/user";

export class FindUserRepositoryStub implements FindUserRepository {
  findByEmail(_email: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve({
        id: "valid_user_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        created_at: FIXED_DATE,
        password_hash: "hashed_valid_password",
      }),
    );
  }

  findById(_id: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve({
        id: "valid_user_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        created_at: FIXED_DATE,
        password_hash: "hashed_valid_password",
      }),
    );
  }
}
