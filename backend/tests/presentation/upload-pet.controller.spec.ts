import { describe, expect, it, vi } from "vitest";
import { UploadPetController } from "@presentation/controllers/upload-pet.controller";
import { UploadPetValidatorStub } from "./doubles/upload-pet.validator.stub";
import { UploadPetUseCaseStub } from "./doubles/upload-pet.usecase.stub";
import { FIXED_DATE } from "../config/constants";
import { AppError } from "@application/errors/app-error";

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
      petName: "any_pet_name",
    },
    user: {
      sub: "authenticated_user_id",
      name: "authenticated_user_name",
      email: "authenticated_user_email",
    },
    file: {
      originalname: "any_image_name",
      mimetype: "valid/mime-type",
      buffer: Buffer.from("any_image_buffer"),
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
      petName: "valid_pet_name",
      userId: "valid_user_id",
      image: {
        originalName: "valid_image_name",
        mimeType: "valid/mime-type",
        buffer: Buffer.from("any_image_buffer"),
      },
    });
  });

  it("Should return 200 with pet data on successful upload", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_pet_id",
      owner_id: "valid_owner_id",
      name: "valid_pet_name",
      type: "dog",
      image_url: "valid_pet_image_url",
      caption: "generated_caption",
      created_at: FIXED_DATE,
    });
  });

  it("Should return 400 if validation fails", async () => {
    const { sut, httpValidatorSpy } = makeSut();
    httpValidatorSpy.mockImplementationOnce(() => {
      throw new AppError("INVALID_PARAM", "petName");
    });
    const httpResponse = await sut.handle(dummyRequest);
    expect(httpResponse.status).toBe(400);
    expect(httpResponse.body.message).toEqual("Invalid Param: petName");
  });
});
