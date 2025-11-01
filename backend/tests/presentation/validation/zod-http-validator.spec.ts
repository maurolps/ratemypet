import { AppError } from "@application/errors/app-error";
import { ZodHttpValidator } from "@presentation/validation/zod-http-validator";
import {
  type FakeDataDTO,
  validationSchema,
} from "../mocks/validation-schema.mock";
import { describe, expect, it } from "vitest";

describe("ZodHttpValidator", () => {
  const sut = new ZodHttpValidator<FakeDataDTO>(validationSchema);
  const makeRequest = (overrides: Partial<FakeDataDTO>) => {
    return {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        ...overrides,
      },
    };
  };

  it("Should return a DataDTO when validating a valid request body", () => {
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

  it.each([["name"], ["email"], ["password"]])(
    "Should throw an AppError if %s is missing",
    (missingParam) => {
      const request = makeRequest({}).body;
      delete request[missingParam as keyof typeof request];
      expect(() => sut.execute({ body: request })).toThrowError(
        new AppError("MISSING_PARAM", missingParam),
      );
    },
  );

  it("Should throw an AppError if email is invalid", () => {
    const request = makeRequest({ email: "invalid_email" });
    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_PARAM", "email"),
    );
  });

  it("Should throw if password has less than 6 characters", () => {
    const request = makeRequest({ password: "123" });
    expect(() => sut.execute(request)).toThrowError(
      new AppError("WEAK_PASSWORD"),
    );
  });

  it("Should throw if name has less than 3 characters", () => {
    const request = makeRequest({ name: "ab" });
    expect(() => sut.execute(request)).toThrowError(
      new AppError("INVALID_NAME"),
    );
  });

  it("Should normalize and sanitize the name field", () => {
    const request = makeRequest({ name: " Valid   Name\t\n " });
    const result = sut.execute(request);
    expect(result.name).toEqual("Valid Name");
  });

  it("Should normalize the email field", () => {
    const request = makeRequest({ email: " Valid_Email@mail.com " });
    const result = sut.execute(request);
    expect(result.email).toEqual("valid_email@mail.com");
  });
});
