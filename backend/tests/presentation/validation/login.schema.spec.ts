import type { LoginDTO } from "@domain/usecases/login.contract";
import { AppError } from "@application/errors/app-error";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import { describe, expect, it } from "vitest";
import { loginSchema } from "@presentation/validation/login.schema";

describe("ZodHttpValidator CreateUser", () => {
  const sut = new ZodHttpValidator<LoginDTO>(loginSchema);
  const makeRequest = (overrides: Partial<LoginDTO>) => {
    return {
      body: {
        email: "valid_email@mail.com",
        password: "valid_password",
        ...overrides,
      },
    };
  };

  it("Should return an LoginDTO when validating a valid request body", () => {
    const request = makeRequest({});
    const result = sut.execute(request);
    expect(result).toEqual(request.body);
  });

  it("Should throw an AppError if body is missing", () => {
    const request = {};
    expect(() => sut.execute(request)).toThrowError(
      new AppError("MISSING_BODY"),
    );
  });

  it.each([["email"], ["password"]])(
    "Should throw an AppError if %s is missing",
    (missingParam) => {
      const request = makeRequest({}).body;
      delete request[missingParam as keyof typeof request];
      expect(() => sut.execute({ body: request })).toThrowError(
        new AppError("MISSING_PARAM", missingParam),
      );
    },
  );

  it("Should normalize the email field", () => {
    const request = makeRequest({ email: " Valid_Email@mail.com " });
    const result = sut.execute(request);
    expect(result.email).toEqual("valid_email@mail.com");
  });
});
