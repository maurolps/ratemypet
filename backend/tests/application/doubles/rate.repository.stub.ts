import type { RateRepository } from "@application/repositories/rate.repository";
import type { Rate } from "@domain/entities/rate";
import { FIXED_DATE } from "../../config/constants";

export class RateRepositoryStub implements RateRepository {
  async findByPetIdAndUserId(
    petId: string,
    userId: string,
  ): Promise<Rate | null> {
    return {
      petId,
      userId,
      rate: "cute",
      createdAt: FIXED_DATE,
      updatedAt: FIXED_DATE,
    };
  }

  async upsert(rate: Rate): Promise<Rate> {
    return {
      petId: rate.petId,
      userId: rate.userId,
      rate: rate.rate,
      createdAt: FIXED_DATE,
      updatedAt: FIXED_DATE,
    };
  }
}
