import type { ClassifiedPet } from "@domain/entities/pet";
import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";

export interface PetClassifier {
  classify(petDTO: UploadPetDTO): Promise<ClassifiedPet>;
}
