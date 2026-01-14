import type { PetStorage } from "@application/ports/pet-storage.contract";
import type { PetImage } from "@domain/entities/pet";

export class PetStorageStub implements PetStorage {
  async upload(_image: PetImage): Promise<string> {
    return "pet_image_url";
  }

  async delete(_imageUrl: string): Promise<void> {
    return;
  }
}
