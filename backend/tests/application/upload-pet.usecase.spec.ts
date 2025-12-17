import { describe, expect, it, vi } from "vitest";
import { UploadPetUseCase } from "@application/usecases/upload-pet.usecase";
import { PetClassifierStub } from "./doubles/pet-classifier.stub";

describe("UploadPetUseCase", () => {
  const makeSut = () => {
    const petClassifierStub = new PetClassifierStub();
    const petClassifierSpy = vi.spyOn(petClassifierStub, "classify");
    const sut = new UploadPetUseCase(petClassifierStub);
    return { sut, petClassifierSpy };
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

  it("Should call PetClassifier with correct values", async () => {
    const { sut, petClassifierSpy } = makeSut();
    await sut.execute(validPetDTO);
    expect(petClassifierSpy).toHaveBeenCalledWith(validPetDTO);
  });
});
