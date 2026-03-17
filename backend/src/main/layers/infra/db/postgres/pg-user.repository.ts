import type { CreateUserRepository } from "@application/repositories/create-user.repository";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { User } from "@domain/entities/user";
import type { CreateUserData } from "@application/repositories/create-user.repository";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/user.sql";
import { toUser, type UserRow } from "@infra/mappers/user-mapper";

export class PgUserRepository
  implements CreateUserRepository, FindUserRepository
{
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async create(
    userDTO: CreateUserData,
    transaction?: Transaction,
  ): Promise<User> {
    const client = (transaction ? transaction : this.pool) as typeof this.pool;
    const { name, email, picture, display_name, bio } = userDTO;
    const userRows = await client.query<UserRow>(sql.CREATE_USER, [
      name,
      email,
      picture ?? null,
      display_name,
      bio,
    ]);
    return toUser(userRows.rows[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRows = await this.pool.query<UserRow>(sql.FIND_BY_EMAIL, [email]);
    const user = userRows.rows[0] || null;
    return user ? toUser(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userRows = await this.pool.query<UserRow>(sql.FIND_BY_ID, [id]);
    const user = userRows.rows[0] || null;
    return user ? toUser(user) : null;
  }
}
