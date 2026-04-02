import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { DeleteRateRepository } from "@application/repositories/delete-rate.repository";

export class DeleteRateRepositoryStub implements DeleteRateRepository {
  async deleteByPetIdAndUserId(
    _: string,
    __: string,
    ___?: Transaction,
  ): Promise<boolean> {
    return true;
  }
}
