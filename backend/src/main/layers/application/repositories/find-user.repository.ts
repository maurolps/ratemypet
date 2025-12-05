import type { User } from "@domain/entities/user";

export interface FindUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
