import { describe, expect, it, vi } from "vitest";
import { UploadPetUseCase } from "@application/usecases/upload-pet.usecase";
import { PetClassifierStub } from "./doubles/pet-classifier.stub";
import { ImageCompressorStub } from "./doubles/image-compressor.stub";
import { PetStorageStub } from "./doubles/pet-storage.stub";
import { UploadPetRepositoryStub } from "./doubles/upload-pet.repository.stub";

describe("UploadPetUseCase", () => {
  const makeSut = () => {
    const petClassifierStub = new PetClassifierStub();
    const petClassifierSpy = vi.spyOn(petClassifierStub, "classify");
    const imageCompressorStub = new ImageCompressorStub();
    const imageCompressorSpy = vi.spyOn(imageCompressorStub, "compress");
    const petStorageStub = new PetStorageStub();
    const petStorageSpy = vi.spyOn(petStorageStub, "upload");
    const uploadPetRepositoryStub = new UploadPetRepositoryStub();
    const uploadPetRepositorySpy = vi.spyOn(uploadPetRepositoryStub, "save");
    const sut = new UploadPetUseCase(
      imageCompressorStub,
      petClassifierStub,
      petStorageStub,
      uploadPetRepositoryStub,
    );
    return {
      sut,
      petClassifierSpy,
      imageCompressorSpy,
      petStorageSpy,
      uploadPetRepositorySpy,
    };
  };

  const validPetDTO = {
    petName: "any_pet_name",
    userId: "any_user_id",
    image: {
      originalName: "any_image_name",
      mimeType: "valid/mime-type",
      buffer: Buffer.from("any_image_buffer"),
    },
  };

  it("Should call ImageCompressor with correct values", async () => {
    const { sut, imageCompressorSpy } = makeSut();
    await sut.execute(validPetDTO);
    expect(imageCompressorSpy).toHaveBeenCalledWith(
      Buffer.from("any_image_buffer"),
    );
  });

  it("Should call PetClassifer with correct values", async () => {
    const { sut, petClassifierSpy } = makeSut();
    await sut.execute(validPetDTO);
    expect(petClassifierSpy).toHaveBeenCalledWith({
      petName: "any_pet_name",
      userId: "any_user_id",
      image: {
        originalName: "any_image_name",
        mimeType: "valid/mime-type",
        buffer: Buffer.from("compressed_image_buffer"),
      },
    });
  });

  it("Should call PetStorage with correct values", async () => {
    const { sut, petStorageSpy } = makeSut();
    await sut.execute(validPetDTO);
    expect(petStorageSpy).toHaveBeenCalledWith({
      originalName: "any_image_name",
      mimeType: "valid/mime-type",
      buffer: Buffer.from("compressed_image_buffer"),
    });
  });

  it("Should call UploadPetRepository with correct values", async () => {
    const { sut, uploadPetRepositorySpy } = makeSut();
    await sut.execute(validPetDTO);
    expect(uploadPetRepositorySpy).toHaveBeenCalledWith({
      petName: "any_pet_name",
      type: "dog",
      image_url: "pet_image_url",
      caption: "generated_caption",
    });
  });
});
