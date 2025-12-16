import { describe, expect, it, vi } from "vitest";
import { UploadPetController } from "@presentation/controllers/upload-pet.controller";
import { UploadPetValidatorStub } from "./doubles/upload-pet.validator.stub";
import { UploadPetUseCaseStub } from "./doubles/upload-pet.usecase.stub";

describe("UploadPetController", () => {
  const makeSut = () => {
    const httpValidatorStub = new UploadPetValidatorStub();
    const uploadPetUseCaseStub = new UploadPetUseCaseStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const uploadPetUseCaseSpy = vi.spyOn(uploadPetUseCaseStub, "execute");
    const sut = new UploadPetController(
      httpValidatorStub,
      uploadPetUseCaseStub,
    );
    return { sut, httpValidatorSpy, uploadPetUseCaseSpy };
  };

  const dummyRequest = {
    body: {
      name: "any_pet_name",
    },
    user: {
      sub: "authenticated_user_id",
      name: "authenticated_user_name",
      email: "authenticated_user_email",
    },
    file: {
      originalname: "any_image_name",
      mimetype: "valid/mime-type",
      buffer: "any_image_buffer",
    },
  };

  it("Should call HttpValidator with correct values", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(httpValidatorSpy).toHaveBeenCalledWith(dummyRequest);
  });

  it("Should call UploadPet use case with correct values", async () => {
    const { sut, uploadPetUseCaseSpy } = makeSut();
    await sut.handle(dummyRequest);
    expect(uploadPetUseCaseSpy).toHaveBeenCalledWith({
      name: "valid_pet_name",
      userId: "valid_user_id",
      image: {
        originalName: "valid_image_name",
        mimeType: "valid/mime-type",
        buffer: Buffer.from("any_image_buffer"),
      },
    });
  });
});
