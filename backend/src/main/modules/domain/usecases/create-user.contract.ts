import type { User } from "../entities/user";

export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
}

export interface CreateUser {
  execute(user: CreateUserDTO): Promise<User>;
}
