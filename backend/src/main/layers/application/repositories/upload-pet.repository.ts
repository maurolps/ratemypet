import type { Pet, UnsavedPet } from "@domain/entities/pet";

export interface UploadPetRepository {
  save(pet: UnsavedPet): Promise<Pet>;
  countByOwnerId(ownerId: string): Promise<number>;
}
