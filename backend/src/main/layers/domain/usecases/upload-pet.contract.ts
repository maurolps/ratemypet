import type { Pet, PetImage } from "@domain/entities/pet";

export interface UploadPetDTO {
  name: string;
  userId: string;
  image: PetImage;
}

export interface UploadPet {
  execute(petDTO: UploadPetDTO): Promise<Pet>;
}
