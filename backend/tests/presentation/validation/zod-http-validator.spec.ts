import { describe, expect, it } from "vitest";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { createUserSchema } from "@presentation/validation/create-user.schema";
import { AppError } from "@presentation/errors/app-error";
import type { CreateUserDTO } from "@domain/usecases/create-user";

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

  it.each([["name"], ["email"], ["password"]])(
    "Should throw an AppError if %s is missing",
    (missingParam) => {
      const sut = new ZodHttpValidator(createUserSchema);
      const request: CreateUserDTO = {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      };
      delete request[missingParam as keyof typeof request];

      expect(() => sut.execute({ body: request })).toThrowError(
        new AppError("MISSING_PARAM", missingParam),
      );
    },
  );

  it("Should throw an AppError if email is invalid", () => {
    const sut = new ZodHttpValidator(createUserSchema);
    const request = {
      body: {
        name: "valid_name",
        email: "invalid_email",
        password: "valid_password",
      },
    };
    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "email"),
    );
  });

  it("Should throw if password has less than 6 characters", () => {
    const sut = new ZodHttpValidator(createUserSchema);
    const request = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "123",
      },
    };
    expect(() => sut.execute(request)).toThrowError(
      new AppError("WEAK_PASSWORD"),
    );
  });

  it("Should throw if name has less than 3 characters", () => {
    const sut = new ZodHttpValidator(createUserSchema);
    const request = {
      body: {
        name: "ab",
        email: "valid_email@mail.com",
        password: "valid_password",
      },
    };
    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_NAME"),
    );
  });
});
