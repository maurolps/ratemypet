import type { User } from "../entities/user";

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface CreateUser {
  create(user: CreateUserDTO): Promise<User>;
}
