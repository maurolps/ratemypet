import type { UploadPetRepository } from "@application/repositories/upload-pet.repository";
import type { Pet, UnsavedPet } from "@domain/entities/pet";

export class UploadPetRepositoryStub implements UploadPetRepository {
  async save(pet: UnsavedPet): Promise<Pet> {
    return {
      ...pet,
      id: "generated_pet_uuid",
      created_at: new Date(),
    };
  }
}
