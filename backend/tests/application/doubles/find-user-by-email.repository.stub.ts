import { FIXED_DATE } from "../../config/constants";
import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { User } from "@domain/entities/user";

export class FindUserByEmailRepositoryStub
  implements FindUserByEmailRepository
{
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
}
