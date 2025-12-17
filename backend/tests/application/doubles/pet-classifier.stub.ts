import type { PetClassifier } from "@application/ports/pet-classifier.contract";
import type { ClassifiedPet } from "@domain/entities/pet";
import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";

export class PetClassifierStub implements PetClassifier {
  async classify(_petDTO: UploadPetDTO): Promise<ClassifiedPet> {
    return {
      type: "dog",
      caption: "generated_caption",
    };
  }
}
