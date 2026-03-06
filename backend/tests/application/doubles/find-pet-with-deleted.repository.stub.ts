import type { FindPetWithDeletedRepository } from "@application/repositories/find-pet-with-deleted.repository";
import type { Pet } from "@domain/entities/pet";

export class FindPetWithDeletedRepositoryStub
  implements FindPetWithDeletedRepository
{
  async findByIdIncludingDeleted(petId: string): Promise<Pet | null> {
    return {
      id: petId,
      owner_id: "valid_owner_id",
      name: "valid_pet_name",
      type: "dog",
      image_url: "valid_pet_image_url",
      caption: "valid_caption",
      created_at: new Date(),
      deleted_at: null,
    };
  }
}
