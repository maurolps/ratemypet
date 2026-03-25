import { AppError } from "@application/errors/app-error";
import type { DeleteRateDTO } from "@domain/usecases/delete-rate.contract";
import { deleteRateSchema } from "@presentation/validation/delete-rate.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator DeleteRate", () => {
  const sut = new ZodHttpValidator<DeleteRateDTO>(deleteRateSchema);
  const validPetId = crypto.randomUUID();
  const validUserId = crypto.randomUUID();

  const makeRequest = (
    id = validPetId as string,
    userId = validUserId as string,
  ) => {
    return {
      params: {
        id,
      },
      user: {
        sub: userId,
        name: "any_name",
        email: "any_email@mail.com",
      },
    };
  };

  it("Should return a DeleteRateDTO when validating a valid request", () => {
    const request = makeRequest();

    const result = sut.execute(request);

    expect(result).toEqual({
      petId: validPetId,
      userId: validUserId,
    });
  });

  it("Should throw an AppError if params is missing", () => {
    const request = {
      user: {
        sub: validUserId,
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
        sub: validUserId,
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

  it("Should throw an AppError if user.sub is invalid", () => {
    const request = makeRequest(validPetId, "invalid_user_id");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "sub"),
    );
  });
});
