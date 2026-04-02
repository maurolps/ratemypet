import type { DeleteRateRepository } from "@application/repositories/delete-rate.repository";
import type {
  RateRepository,
  UpsertResult,
} from "@application/repositories/rate.repository";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Rate } from "@domain/entities/rate";
import { toRate, type RateRow } from "@infra/mappers/rate-mapper";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/rate.sql";

type UpsertRateRow = RateRow & {
  was_created: boolean;
};

export class PgRateRepository implements RateRepository, DeleteRateRepository {
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async findByPetIdAndUserId(
    petId: string,
    userId: string,
  ): Promise<Rate | null> {
    const rateRows = await this.pool.query<RateRow>(sql.FIND_RATE, [
      petId,
      userId,
    ]);
    const rateRow = rateRows.rows[0];
    const rate = rateRow ? toRate(rateRow) : null;
    return rate;
  }

  async upsert(rate: Rate, transaction?: Transaction): Promise<UpsertResult> {
    const client = (transaction ? transaction : this.pool) as PgPool;
    const rateRows = await client.query<UpsertRateRow>(sql.UPSERT_RATE, [
      rate.petId,
      rate.userId,
      rate.rate,
    ]);

    const upsertedRate = rateRows.rows[0];
    const wasCreated = upsertedRate.was_created;
    const mappedRate = toRate(upsertedRate);

    return {
      rate: mappedRate,
      wasCreated,
    };
  }

  async deleteByPetIdAndUserId(
    petId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.pool.query(sql.DELETE_RATE, [petId, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
