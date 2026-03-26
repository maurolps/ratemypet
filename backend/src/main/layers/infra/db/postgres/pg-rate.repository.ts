import type { DeleteRateRepository } from "@application/repositories/delete-rate.repository";
import type { RateRepository } from "@application/repositories/rate.repository";
import type { Rate } from "@domain/entities/rate";
import { toRate, type RateRow } from "@infra/mappers/rate-mapper";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/rate.sql";

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

  async upsert(rate: Rate): Promise<Rate> {
    const rateRows = await this.pool.query<RateRow>(sql.UPSERT_RATE, [
      rate.petId,
      rate.userId,
      rate.rate,
    ]);
    return toRate(rateRows.rows[0]);
  }

  async deleteByPetIdAndUserId(
    petId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await this.pool.query(sql.DELETE_RATE, [petId, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
