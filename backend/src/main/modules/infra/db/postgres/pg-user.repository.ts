import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type { User } from "@domain/entities/user";
import type { CreateUserDTO } from "@domain/usecases/create-user.contract";
import type { PgPool } from "./helpers/pg-pool";
import { CREATE_USER } from "./sql/user.sql";

export class PgUserRepository implements CreateUserRepository {
  constructor(private readonly pool: PgPool) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const { name, email, password: passwordHash } = userDTO;
    const userRows = await this.pool.query<User>(CREATE_USER, [
      name,
      email,
      passwordHash,
    ]);
    const user = userRows.rows[0];
    return user;
  }
}
