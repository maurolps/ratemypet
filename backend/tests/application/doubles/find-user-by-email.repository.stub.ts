import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { User } from "@domain/entities/user";

export class FindUserByEmailRepositoryStub
  implements FindUserByEmailRepository
{
  perform(email: string): Promise<User | null> {
    return new Promise((resolve) =>
      resolve({
        id: "valid_id",
        name: "valid_name",
        email,
      }),
    );
  }
}
