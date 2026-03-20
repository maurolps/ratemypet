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
        displayName: "valid_display_name",
        bio: "Pet lover 🐶",
        createdAt: FIXED_DATE,
      }),
    );
  }

  findById(_id: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve({
        id: "valid_user_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        displayName: "valid_display_name",
        bio: "Pet lover 🐶",
        createdAt: FIXED_DATE,
      }),
    );
  }
}
