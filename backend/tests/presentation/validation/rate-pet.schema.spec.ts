import { AppError } from "@application/errors/app-error";
import type { RatePetDTO } from "@domain/usecases/rate-pet.contract";
import { ratePetSchema } from "@presentation/validation/rate-pet.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator RatePet", () => {
  const sut = new ZodHttpValidator<RatePetDTO>(ratePetSchema);

  const fakeUserId = crypto.randomUUID() as string;
  const fakePetId = crypto.randomUUID() as string;

  const makeRequest = (id = fakePetId, rate = "majestic") => {
    return {
      params: {
        id,
      },
      body: {
        rate,
      },
      user: {
        sub: fakeUserId,
        name: "any_name",
        email: "any_email@mail.com",
      },
    };
  };

  it("Should return a RatePetDTO when validating a valid request", () => {
    const request = makeRequest();

    const result = sut.execute(request);

    expect(result).toEqual({
      petId: fakePetId,
      userId: fakeUserId,
      rate: "majestic",
    });
  });

  it("Should throw an AppError if body is missing", () => {
    const request = {
      params: {
        id: fakePetId,
      },
      user: {
        sub: fakeUserId,
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_BODY"),
    );
  });

  it("Should throw an AppError if params.id is invalid", () => {
    const request = makeRequest("invalid_pet_id");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "id"),
    );
  });

  it("Should throw an AppError if body.rate is invalid", () => {
    const request = makeRequest(undefined, "angry");

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "rate"),
    );
  });

  it("Should throw an AppError if body.rate is missing", () => {
    const request = {
      params: {
        id: fakePetId,
      },
      body: {},
      user: {
        sub: fakeUserId,
        name: "any_name",
        email: "any_email@mail.com",
      },
    };

    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "rate"),
    );
  });
});
