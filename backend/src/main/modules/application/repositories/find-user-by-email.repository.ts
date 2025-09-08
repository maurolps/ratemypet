import type { User } from "@domain/entities/user";

export interface FindUserByEmailRepository {
  perform(email: string): Promise<User | null>;
}
