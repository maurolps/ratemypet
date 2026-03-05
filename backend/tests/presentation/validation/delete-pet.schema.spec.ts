import type { DeletePetDTO } from "@domain/usecases/delete-pet.contract";
import { AppError } from "@application/errors/app-error";
import { deletePetSchema } from "@presentation/validation/delete-pet.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator DeletePet", () => {
  const sut = new ZodHttpValidator<DeletePetDTO>(deletePetSchema);
  const validPetId = crypto.randomUUID();

  const makeRequest = (id = validPetId as string) => {
    return {
      params: {
        id,
      },
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };
  };

  it("Should return a DeletePetDTO when validating a valid request", () => {
    const request = makeRequest();
    const result = sut.execute(request);

    expect(result).toEqual({
      pet_id: validPetId,
      user_id: "valid_user_id",
    });
  });

  it("Should throw an AppError if params is missing", () => {
    const request = {
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "params"),
    );
  });

  it("Should throw an AppError if params.id is missing", () => {
    const request = {
      params: {},
      user: {
        sub: "valid_user_id",
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "id"),
    );
  });

  it("Should throw an AppError if params.id is invalid", () => {
    const request = makeRequest("invalid_pet_id");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "id"),
    );
  });

  it("Should throw an AppError if user is missing", () => {
    const request = {
      params: {
        id: validPetId,
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_PARAM", "user"),
    );
  });
});
