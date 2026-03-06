import type { DeletePetRepository } from "@application/repositories/delete-pet.repository";

export class DeletePetRepositoryStub implements DeletePetRepository {
  async softDeleteById(_: string): Promise<void> {}
}
