import { describe, expect, it, vi } from "vitest";
import type { User } from "@domain/entities/user";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";
import { sql } from "@infra/db/postgres/sql/user.sql";

const makeUniqueEmail = () => `uow_${Date.now()}_${Math.random()}@example.com`;

describe("PgUnitOfWorkAdapter", () => {
  it("Should commit transaction on success", async () => {
    const sut = new PgUnitOfWorkAdapter();
    const email = makeUniqueEmail();

    const result = await sut.execute(async (transactionClient) => {
      const client = transactionClient as PgPool;
      const inserted = await client.query<User>(sql.CREATE_USER, [
        "any_name",
        email,
        "hashed_password",
      ]);
      return inserted.rows[0];
    });

    expect(result.id).toBeTruthy();

    const pool = PgPool.getInstance();
    const persisted = await pool.query<User>(sql.FIND_BY_EMAIL, [email]);
    expect(persisted.rows).toHaveLength(1);
  });

  it("Should rollback transaction on error", async () => {
    const sut = new PgUnitOfWorkAdapter();
    const email = makeUniqueEmail();

    await expect(
      sut.execute(async (transactionClient) => {
        const client = transactionClient as PgPool;
        await client.query<User>(sql.CREATE_USER, [
          "any_name",
          email,
          "hashed_password",
        ]);
        throw new Error("forced failure");
      }),
    ).rejects.toThrow("forced failure");

    const pool = PgPool.getInstance();
    const persisted = await pool.query<User>(sql.FIND_BY_EMAIL, [email]);
    expect(persisted.rows).toHaveLength(0);
  });

  it("Should always release client after execution", async () => {
    /*
    NOTE ON COVERAGE:
   
    This test validates the core contract of the UnitOfWork:
    the database client must always be released after execution.
   
    In additional branch scenarios (BEGIN/COMMIT/ROLLBACK failures),
    the release of the client is still needed but intentionally not covered,
    as they are defensive infra paths.
   */

    const query = vi.fn().mockResolvedValue({ rows: [] });
    const release = vi.fn();
    const connect = vi.fn().mockResolvedValue({ query, release });
    const fakePool = { connect };
    const getInstanceSpy = vi
      .spyOn(PgPool, "getInstance")
      .mockReturnValue(fakePool as unknown as PgPool);

    const sut = new PgUnitOfWorkAdapter();
    await sut.execute(async (transactionClient) => {
      await (transactionClient as PgPool).query("SELECT 1");
      return "ok";
    });

    expect(release).toHaveBeenCalledTimes(1);

    getInstanceSpy.mockRestore();
  });
});
