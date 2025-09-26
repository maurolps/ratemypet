import type { FindUserByEmailRepository } from "@application/repositories/find-user-by-email.repository";
import type { User } from "@domain/entities/user";

export class FindUserByEmailRepositoryStub
  implements FindUserByEmailRepository
{
  findByEmail(_email: string): Promise<User | null> {
    return new Promise((resolve) => resolve(null));
  }
}
