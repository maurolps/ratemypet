import type {
  DeletePet,
  DeletePetDTO,
} from "@domain/usecases/delete-pet.contract";

export class DeletePetUseCaseStub implements DeletePet {
  async execute(_: DeletePetDTO): Promise<void> {}
}
