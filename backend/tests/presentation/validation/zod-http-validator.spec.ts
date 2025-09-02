import { describe, expect, it } from "vitest";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { createUserSchema } from "@presentation/validation/create-user.schema";
import { AppError } from "@presentation/errors/app-error";

describe("ZodHttpValidator", () => {
  it("Should return a UserDTO when validating a valid request body", () => {
    const sut = new ZodHttpValidator(createUserSchema);
    const request = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      },
    };
    const result = sut.execute(request);
    expect(result).toEqual({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    });
  });

  it("Should throw an AppError if body is missing", () => {
    const sut = new ZodHttpValidator(createUserSchema);
    const request = {};

    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_BODY"),
    );
  });
});
