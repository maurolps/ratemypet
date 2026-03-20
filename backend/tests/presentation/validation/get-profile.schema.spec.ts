import type { GetProfileDTO } from "@domain/usecases/get-profile.contract";
import { AppError } from "@application/errors/app-error";
import { getProfileSchema } from "@presentation/validation/get-profile.schema";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator GetProfile", () => {
  const sut = new ZodHttpValidator<GetProfileDTO>(getProfileSchema);
  const validUserId = crypto.randomUUID();

  it("Should return a GetProfileDTO when validating a valid request", () => {
    const result = sut.execute({
      params: {
        id: validUserId,
      },
    });

    expect(result).toEqual({
      user_id: validUserId,
    });
  });

  it("Should throw an AppError if params is missing", () => {
    expect(() => sut.execute({})).toThrowError(
      new AppError("MISSING_PARAM", "params"),
    );
  });

  it("Should throw an AppError if params.id is missing", () => {
    expect(() =>
      sut.execute({
        params: {},
      }),
    ).toThrowError(new AppError("MISSING_PARAM", "id"));
  });

  it("Should throw an AppError if params.id is not a valid uuid", () => {
    expect(() =>
      sut.execute({
        params: {
          id: "invalid_id",
        },
      }),
    ).toThrowError(new AppError("INVALID_PARAM", "id"));
  });
});
