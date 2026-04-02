import type { Transaction } from "@application/ports/unit-of-work.contract";

export interface DeleteRateRepository {
  deleteByPetIdAndUserId(
    petId: string,
    userId: string,
    transaction?: Transaction,
  ): Promise<boolean>;
}
