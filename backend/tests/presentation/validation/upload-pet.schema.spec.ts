import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";
import { describe, expect, it } from "vitest";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { uploadPetSchema } from "@presentation/validation/upload-pet.schema";
import { AppError } from "@application/errors/app-error";

describe("ZodHttpValidator UploadPet", () => {
  const sut = new ZodHttpValidator<UploadPetDTO>(uploadPetSchema);
  const dummyRequest = {
    body: {
      petName: "any_pet_name",
    },
    user: {
      sub: "authenticated_user_id",
      name: "authenticated_user_name",
      email: "authenticated_user_email@mail.com",
    },
    file: {
      originalname: "any_image_name",
      mimetype: "image/png",
      buffer: "any_image_buffer",
    },
  };

  it("Should return an UploadPetDTO when validating a valid request body", () => {
    const result = sut.execute(dummyRequest);
    expect(result).toEqual({
      petName: "any_pet_name",
      userId: "authenticated_user_id",
      image: {
        originalName: "any_image_name",
        mimeType: "image/png",
        buffer: "any_image_buffer",
      },
    });
  });

  it("Should return 400 when the request is malformed", () => {
    const malformedRequest = {
      ...dummyRequest,
      body: {},
    };
    const execute = () => sut.execute(malformedRequest);
    expect(execute).toThrow(new AppError("MISSING_PARAM", "petName"));
  });

  it("Should normalize textual inputs", () => {
    const requestWithExtraSpaces = {
      ...dummyRequest,
      body: {
        petName: "   any_pet_name   ",
      },
    };
    const result = sut.execute(requestWithExtraSpaces);
    expect(result).toEqual({
      petName: "any_pet_name",
      userId: "authenticated_user_id",
      image: {
        originalName: "any_image_name",
        mimeType: "image/png",
        buffer: "any_image_buffer",
      },
    });
  });
});
