import { describe, expect, it, vi } from "vitest";
import { UploadPetController } from "@presentation/controllers/upload-pet.controller";
import { UploadPetValidatorStub } from "./doubles/upload-pet.validator.stub";

describe("UploadPetController", () => {
  const makeSut = () => {
    const httpValidatorStub = new UploadPetValidatorStub();
    const httpValidatorSpy = vi.spyOn(httpValidatorStub, "execute");
    const sut = new UploadPetController(httpValidatorStub);
    return { sut, httpValidatorSpy };
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
});
