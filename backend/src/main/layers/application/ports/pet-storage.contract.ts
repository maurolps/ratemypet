import type { PetImage } from "@domain/entities/pet";

export interface PetStorage {
  upload(image: PetImage): Promise<string>;
  delete(imageUrl: string): Promise<void>;
}
