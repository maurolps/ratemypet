import type { ImageCompressor } from "@application/ports/image-compressor.contract";
import type { PetClassifier } from "@application/ports/pet-classifier.contract";
import type { PetStorage } from "@application/ports/pet-storage.contract";
import type { Pet } from "@domain/entities/pet";
import type {
  UploadPet,
  UploadPetDTO,
} from "@domain/usecases/upload-pet.contract";

export class UploadPetUseCase implements UploadPet {
  constructor(
    private readonly imageCompressor: ImageCompressor,
    private readonly petClassifer: PetClassifier,
    private readonly petStorage: PetStorage,
  ) {}

  async execute(petDTO: UploadPetDTO): Promise<Pet> {
    const compressedImageBuffer = await this.imageCompressor.compress(
      petDTO.image.buffer,
    );

    const classifiedPet = await this.petClassifer.classify({
      ...petDTO,
      image: {
        ...petDTO.image,
        buffer: compressedImageBuffer,
      },
    });

    const imageUrl = await this.petStorage.upload({
      originalName: petDTO.image.originalName,
      buffer: compressedImageBuffer,
      mimeType: petDTO.image.mimeType,
    });

    return {
      id: "any_pet_uuid",
      petName: petDTO.petName,
      type: classifiedPet.type,
      image_url: imageUrl,
      caption: classifiedPet.caption,
      created_at: new Date(),
    };
  }
}
