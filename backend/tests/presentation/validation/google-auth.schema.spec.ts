import { AppError } from "@application/errors/app-error";
import type { GoogleAuthDTO } from "@domain/usecases/google-auth.contract";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";
import { googleAuthSchema } from "@presentation/validation/google-auth.schema";

describe("ZodHttpValidator GoogleAuth", () => {
  const sut = new ZodHttpValidator<GoogleAuthDTO>(googleAuthSchema);

  it("Should return a GoogleAuthDTO when validating a valid request body", () => {
    const request = {
      body: {
        id_token: "valid_google_id_token",
      },
    };

    const result = sut.execute(request);

    expect(result).toEqual(request.body);
  });

  it("Should throw an AppError if body is missing", () => {
    expect(() => sut.execute({})).toThrowError(new AppError("MISSING_BODY"));
  });

  it("Should throw an AppError if id_token is missing", () => {
    expect(() => sut.execute({ body: {} })).toThrowError(
      new AppError("MISSING_PARAM", "id_token"),
    );
  });

  it("Should trim the id_token field", () => {
    const result = sut.execute({
      body: {
        id_token: " valid_google_id_token ",
      },
    });

    expect(result.id_token).toEqual("valid_google_id_token");
  });
});
