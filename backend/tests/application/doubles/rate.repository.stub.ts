import type { Transaction } from "@application/ports/unit-of-work.contract";
import type {
  RateRepository,
  UpsertResult,
} from "@application/repositories/rate.repository";
import type { Rate } from "@domain/entities/rate";
import { FIXED_DATE } from "../../config/constants";

export class RateRepositoryStub implements RateRepository {
  async findByPetIdAndUserId(_: string, __: string): Promise<Rate | null> {
    return null;
  }

  async upsert(rate: Rate, _: Transaction = {}): Promise<UpsertResult> {
    return {
      rate: {
        petId: rate.petId,
        userId: rate.userId,
        rate: rate.rate,
        createdAt: FIXED_DATE,
        updatedAt: FIXED_DATE,
      },
      wasCreated: true,
    };
  }
}
