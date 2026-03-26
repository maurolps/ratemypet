import type { Rate } from "@domain/entities/rate";

export interface RateRepository {
  findByPetIdAndUserId(petId: string, userId: string): Promise<Rate | null>;
  upsert(rate: Rate): Promise<Rate>;
}
