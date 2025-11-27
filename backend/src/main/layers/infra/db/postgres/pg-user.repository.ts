import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { User } from "@domain/entities/user";
import type { CreateUserDTO } from "@domain/usecases/create-user.contract";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/user.sql";

export class PgUserRepository
  implements CreateUserRepository, FindUserRepository
{
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const { name, email, password: passwordHash } = userDTO;
    const userRows = await this.pool.query<User>(sql.CREATE_USER, [
      name,
      email,
      passwordHash,
    ]);
    const user = userRows.rows[0];
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRows = await this.pool.query<User>(sql.FIND_BY_EMAIL, [email]);
    const user = userRows.rows[0] || null;
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const userRows = await this.pool.query<User>(sql.FIND_BY_ID, [id]);
    const user = userRows.rows[0] || null;
    return user;
  }
}
