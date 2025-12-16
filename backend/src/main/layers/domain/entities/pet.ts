import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";

export type PetType = "dog" | "cat";

export type Pet = {
  id: string;
  petName: string;
  type: PetType;
  image_url: string;
  caption: string;
  created_at: Date;
};
