import type { UploadPetDTO } from "@domain/usecases/upload-pet.contract";
import { describe, expect, it } from "vitest";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { uploadPetSchema } from "@presentation/validation/upload-pet.schema";

describe("ZodHttpValidator UploadPet", () => {
  const sut = new ZodHttpValidator<UploadPetDTO>(uploadPetSchema);
  const dummyRequest = {
    body: {
      name: "any_pet_name",
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
      name: "any_pet_name",
      userId: "authenticated_user_id",
      image: {
        originalName: "any_image_name",
        mimeType: "image/png",
        buffer: "any_image_buffer",
      },
    });
  });
});
