import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { Pet } from "@domain/entities/pet";

export interface FindPetWithDeletedRepository {
  findByIdIncludingDeleted(
    petId: string,
    transaction?: Transaction,
  ): Promise<Pet | null>;
}
