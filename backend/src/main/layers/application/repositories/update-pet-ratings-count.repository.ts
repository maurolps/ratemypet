import type { Transaction } from "@application/ports/unit-of-work.contract";

export interface UpdatePetRatingsCountRepository {
  incrementRatingsCount(
    petId: string,
    transaction?: Transaction,
  ): Promise<void>;
}
