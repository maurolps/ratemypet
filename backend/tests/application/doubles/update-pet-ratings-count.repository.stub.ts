import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { UpdatePetRatingsCountRepository } from "@application/repositories/update-pet-ratings-count.repository";

export class UpdatePetRatingsCountRepositoryStub
  implements UpdatePetRatingsCountRepository
{
  async incrementRatingsCount(_: string, __: Transaction = {}): Promise<void> {}

  async decrementRatingsCount(_: string, __: Transaction = {}): Promise<void> {}
}
