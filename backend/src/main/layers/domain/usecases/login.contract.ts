import type { Tokens } from "@domain/entities/token";
import type { User } from "@domain/entities/user";

export interface LoginDTO {
  email: string;
  password: string;
}

export type LoggedUser = Omit<User, "password_hash"> & {
  tokens: Tokens;
};

export interface Login {
  auth(loginDTO: LoginDTO): Promise<LoggedUser>;
}
