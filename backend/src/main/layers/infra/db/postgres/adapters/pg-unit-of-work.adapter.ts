import type {
  Transaction,
  UnitOfWork,
} from "@application/ports/unit-of-work.contract";
import type { PoolClient } from "pg";
import { PgPool } from "../helpers/pg-pool";

export class PgUnitOfWorkAdapter implements UnitOfWork {
  private readonly pgPool: PgPool;

  constructor() {
    this.pgPool = PgPool.getInstance();
  }

  async execute<T>(
    work: (transactionClient: Transaction) => Promise<T>,
  ): Promise<T> {
    const client: PoolClient = await this.pgPool.connect();

    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
