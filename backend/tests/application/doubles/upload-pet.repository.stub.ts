import type { UploadPetRepository } from "@application/repositories/upload-pet.repository";
import type { Pet, UnsavedPet } from "@domain/entities/pet";
import { FIXED_DATE } from "../../config/constants";

export class UploadPetRepositoryStub implements UploadPetRepository {
  async save(pet: UnsavedPet): Promise<Pet> {
    return {
      type: pet.type,
      image_url: pet.image_url,
      caption: pet.caption,
      name: pet.petName,
      id: "generated_pet_uuid",
      created_at: FIXED_DATE,
    };
  }
}
