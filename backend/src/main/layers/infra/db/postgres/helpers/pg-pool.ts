import { Pool, type QueryResultRow } from "pg";

export class PgPool {
  private static instance: PgPool;
  private pool!: Pool;

  private constructor() {}

  public static getInstance(): PgPool {
    if (!PgPool.instance) {
      PgPool.instance = new PgPool();
    }
    return PgPool.instance;
  }

  connect(uri: string) {
    this.pool = new Pool({
      connectionString: uri,
    });
  }

  async query<T extends QueryResultRow>(sql: string, params?: unknown[]) {
    return await this.pool.query<T>(sql, params);
  }

  async health() {
    return await this.pool.query("SELECT 1");
  }

  async disconnect() {
    await this.pool.end();
  }
}
