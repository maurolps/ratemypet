import type { Tokens } from "@domain/entities/token";

export interface LoginDTO {
  email: string;
  password: string;
}

export type UserResponse = {
  id: string;
  email: string;
  displayName: string;
  bio?: string;
  picture?: string | null;
  createdAt: Date;
};

export type LoggedUser = UserResponse & {
  tokens: Tokens;
};

export interface Login {
  auth(loginDTO: LoginDTO): Promise<LoggedUser>;
}
