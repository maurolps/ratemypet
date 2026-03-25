import type { DeleteRateRepository } from "@application/repositories/delete-rate.repository";

export class DeleteRateRepositoryStub implements DeleteRateRepository {
  async deleteByPetIdAndUserId(): Promise<boolean> {
    return true;
  }
}
