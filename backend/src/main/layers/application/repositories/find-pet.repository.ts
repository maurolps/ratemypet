import type { Pet } from "@domain/entities/pet";

export interface FindPetRepository {
  findById(petId: string): Promise<Pet | null>;
}
