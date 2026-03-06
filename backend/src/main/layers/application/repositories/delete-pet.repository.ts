import type { Transaction } from "@application/ports/unit-of-work.contract";

export interface DeletePetRepository {
  softDeleteById(petId: string, transaction?: Transaction): Promise<void>;
}
