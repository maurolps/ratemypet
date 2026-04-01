import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Rate } from "@domain/entities/rate";

export type UpsertOperation = "created" | "updated" | "unchanged";

export type UpsertResult = {
  rate: Rate;
  operation: UpsertOperation;
};

export interface RateRepository {
  findByPetIdAndUserId(petId: string, userId: string): Promise<Rate | null>;
  upsert(rate: Rate, transaction?: Transaction): Promise<UpsertResult>;
}
