import type { Pet } from "@domain/entities/pet";
import type {
  UploadPet,
  UploadPetDTO,
} from "@domain/usecases/upload-pet.contract";
import { FIXED_DATE } from "../../config/constants";

export class UploadPetUseCaseStub implements UploadPet {
  async execute(petDTO: UploadPetDTO): Promise<Pet> {
    const pet: Pet = {
      id: "valid_pet_id",
      petName: petDTO.petName,
      type: "dog",
      image_url: `valid_pet_image_url`,
      caption: "generated_caption",
      created_at: FIXED_DATE,
    };
    return pet;
  }
}
